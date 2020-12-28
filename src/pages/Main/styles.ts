import styled from 'styled-components/native'

export const Container = styled.View`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
interface ButtonActionProps {
  pressed: boolean | undefined;
}
export const ButtonAction = styled.Pressable<ButtonActionProps>`
  height: 80px;
  width: 80px;
  background: ${props=>props.pressed ? '#001e8c': '#014c9c'};
  border-radius: 50px;

  display:flex;
  flex-direction: column;
  align-items:center;
  justify-content:center;
  margin: 20px 0;

`

export const TextButton = styled.Text`
color: #f9f9f9;
font-weight: bold;
text-transform: uppercase;
`
export const LabelHeight = styled.Text``
