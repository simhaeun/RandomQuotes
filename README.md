[![Netlify Status](https://api.netlify.com/api/v1/badges/81b04f3f-a13e-49f8-855c-446217c96eb4/deploy-status)](https://app.netlify.com/sites/hacookie-randomquotes/deploys)

# RandomQuotes
![image](https://user-images.githubusercontent.com/58839497/211774172-0cfcba2f-df4a-433e-b241-7e80a2e026f8.png)
![image](https://user-images.githubusercontent.com/58839497/211774267-b6a34fe8-fb10-4c29-8bf8-fbf8b1890860.png)

## 랜덤 명언 제조기

### 백엔드 맛보기 😛
Rest Api 서버 직접 개발해서 적용해보았다 !

프론트엔드 개발자는 여러 직군들과 소통을 하는 것이 중요하다.

상대가 어떤 일을 하는 지 정확히 인지하고 일을 한다면 소통을 잘 할 수 있겠지 😀 

### 포스트맨(Postman)
- REST API 설계 개발, 테스팅을 할 수 있는 GUI 툴로 개발 생산성을 높여주는 프로그램

![image](https://user-images.githubusercontent.com/58839497/211779022-84a0d3ee-2ce4-4c6c-ab43-3090496577a3.png)
get, post, delete, put 기본적인 사용법을 알아보았다

### axios로 Data 불러오기
```tsx
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
```

## 기능
- 랜덤으로 명언 불러오기
- 
- 명언 리스트 Data 불러오기
- 
- 명언 추가
```tsx
<Flex onClick={() => {
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
      } else {
        alert("생성 실패!")
      }
}}>
  <VscCheck color='white' fontSize={"32px"}/>
</Flex>
```

- 명언 삭제
```tsx
<Flex onClick={() => {
  if(window.confirm("정말 해당 명언을 제거하겠습니까?")) {
    axios.delete('/'+ idx)
    .then(({data}) => {
      if(data.rs) {
        setDataList([])
        alert("제거 완료!")
        axios.get("/")
          .then(e => setDataList(e.data))
          .catch(() => setError('명언을 불러오지 못했습니다.'))
  } else {
    alert("제거 실패!")
  }
})>
  <VscTrash />
</Flex>
```

- 명언 수정
```tsx
<Flex onClick={() => {
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
        } else {
          alert("수정 실패!")
        }
      })
    } else {
       setSelectedData(data.message)
       setEditInp([data.author, data.message])
    }
  }}
>
{
  data.message === selectedData ? <VscCheck/> : <VscEdit/>
}
</Flex>
```

---
개발한 서버를 실행시키지 않으면 명언을 불러오지 못했다는 오류가 뜨는데
![image](https://user-images.githubusercontent.com/58839497/211778128-b67dbff7-09b2-492c-9bc5-ddde67713385.png)
해결 방법은 아직 잘 모른다.. 아직 알아야 할 것들이 너무 많다 !!!
