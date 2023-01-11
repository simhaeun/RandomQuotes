import React, { useEffect, useState }from 'react';
import Box from './compononts/Box';
import Flex from './compononts/Flex';
import { VscListUnordered, VscArrowLeft, VscAdd, VscTrash, VscEdit, VscClose, VscCheck } from 'react-icons/vsc';
import axios from 'axios';
import Data from './interfaces/Data'

axios.defaults.baseURL = 'http://localhost:8080'

function App() {
  const [page, setPage] = useState<'main' | 'edit'>('main');
  const [nowData, setNowData] = useState<null | Data>(null);
  const [dataList, setDataList] = useState<null | Data[]>(null);
  const [error, setError] = useState('');
  const [createMode, setCreateMode] = useState(false);
  const [createInp, setCreateInp] = useState<[string, string]>(["", ""]);
  const [editInp, setEditInp] = useState<[string, string]>(["", ""]);
  const [selectedData, setSelectedData] = useState<string | null>('');

  useEffect(() => {
    if(page === 'main') {
      axios.get("/random")
        .then(e => setNowData(e.data))
        .catch(() => setError('명언을 불러오지 못했습니다.'))
    }
    else {
      axios.get("/")
        .then(e => setDataList(e.data))
        .catch(() => setError('명언을 불러오지 못했습니다.'))
    }
  }, [page])

  if(page === 'main') 
    return (
      <div className='main'>
      <Flex className='mainBtn'>
        <Flex bg="#db993b" width="48px" height={"48px"} borderRadius={"4px"}
          alignItems="center" justifyContent={"center"}
          onClick={() => setPage('edit')}
        >
          <VscListUnordered color='white' fontSize={"32px"}/>
        </Flex>
      </Flex>
        <Flex 
          flexDirection={"column"}
          alignItems="center" 
          height={"100vh"} 
          px="16px"
        >
          <Box className='quoteTitle'>
            오늘의 명언
          </Box>
          <Flex className='quoteText'>
            {error.length > 0 && error}
            <Box width={"100%"}>
              {nowData?.message}
            </Box>
          </Flex>
          <Box className='quoteAuthor'>
            {nowData?.author}
          </Box>
        </Flex>
      </div>
    );
    
    return <Flex pt={"64px"} pl="64px" flexDirection={'column'}>
      <Flex 
        pb="44px" 
        style={{
          gap: "44px"
        }}
      >
        <Flex bg="#db993b" width="48px" height={"48px"} borderRadius={"4px"}
          alignItems="center" justifyContent={"center"}
          onClick={() => setPage('main')}
        >
          <VscArrowLeft color='white' fontSize={"32px"}/>
        </Flex>
        <Flex className='listBtn'
          onClick={() => setCreateMode(prev => !prev)}
        >
          {
            createMode ? <VscClose color='white' fontSize={"32px"}/> 
              : <VscAdd color='white' fontSize={"32px"}/>
          }
        </Flex>
      </Flex>

      {
        createMode && <><Flex width="416px" height={"48px"} mb="16px">
          <Flex flex={1} overflowX="scroll" style={{ whiteSpace: "pre" }}>
            <input 
              value={createInp[0]} 
              onChange={(event) => setCreateInp(prev => [event.target.value, prev[1]])}
              placeholder='저자'
            />
            <input 
              value={createInp[1]} 
              onChange={(event) => setCreateInp(prev => [prev[0], event.target.value])} 
              placeholder='명언 내용'
            />
          </Flex>
          <Flex className='listBtn' 
            onClick={() => {
              if(createInp[0].length === 0 || createInp[1].length === 0) {
                alert("정상적인 값이 아닙니다.")
                return;
              }
              axios.post('/', {
                "author": createInp[0],
                "message": createInp[1]
              }).then(({ data }) => {
                if(data.rs){
                  setDataList([])
                  setCreateInp(['', ''])
                  setCreateMode(false)
                  alert("생성 완료!")
                  axios.get("/")
                    .then(e => setDataList(e.data))
                    .catch(() => setError('명언을 불러오지 못했습니다.'))
                }
                else 
                  alert("생성 실패!")
              })
            }}
          >
            <VscCheck color='white' fontSize={"32px"}/>
          </Flex>
        </Flex>
        </>
      }
      
      {
        dataList?.map((data, idx) => <Flex className='quoteList' height={"48px"} mb="16px" key={data.message}>
          <Flex border={"solid 1px #707070"} flex={1} overflowX="scroll" style={{ whiteSpace: "pre" }}>
            {
              data.message === selectedData ?
                <>
                  <input value={editInp[0]} onChange={(event) => setEditInp(prev => [event.target.value, prev[1]])} />
                  <input value={editInp[1]} onChange={(event) => setEditInp(prev => [prev[0], event.target.value])} />
                </>
                :`[${data.author}] ${data.message}`
            }
          </Flex>
          
          {/* 수정 */}
          <Flex className='listBtn' 
            onClick={() => {
              if(data.message === selectedData) {
                axios.put('/' + idx, {
                  "author": editInp[0],
                  "message": editInp[1]
                }).then(({ data }) => {
                  if(data.rs){
                    setDataList([])
                    setEditInp(['', ''])
                    setSelectedData(null)
                    alert("수정 완료!")
                    axios.get("/")
                      .then(e => setDataList(e.data))
                      .catch(() => setError('명언을 불러오지 못했습니다.'))
                  }
                  else 
                    alert("수정 실패!")
                })
              } else {
                setSelectedData(data.message)
                setEditInp([data.author, data.message])
              }
            }}
          >
            {
              data.message === selectedData ?
                <VscCheck color='white' fontSize={"32px"}/>
                : <VscEdit color='white' fontSize={"32px"}/>
            }
          </Flex>
          
          {/* 삭제 */}
          <Flex className='listBtn' 
            onClick={() => {
              if(window.confirm("정말 해당 명언을 제거하겠습니까?")) {
                axios.delete('/'+ idx)
                .then(({data}) => {
                  if(data.rs){
                    setDataList([])
                    alert("제거 완료!")
                    axios.get("/")
                      .then(e => setDataList(e.data))
                      .catch(() => setError('명언을 불러오지 못했습니다.'))
                  }
                  else 
                    alert("제거 실패!")
                })
              }
            }}>
            <VscTrash color='white' fontSize={"32px"}/>
          </Flex>
        </Flex>
        )
      }
      
    </Flex>
}

export default App;
