import styled from "@emotion/styled";
import { display } from "styled-system";
import Box, { BoxProps } from "./Box";


const Flex = styled(Box) <BoxProps>`
    display: flex;
    ${display}
`

export default Flex;