import React, { ReactElement } from 'react'
import { Text, TextProps } from 'rebass/styled-components'
import styled from 'styled-components'
import { Colors } from '../../types'

const TextWrapper = styled(Text)<{ colour: keyof Colors }>`
  color: ${({ colour, theme }): string => (theme as Colors)[colour]};
  font-size: 1.2rem;
`

export const LayoutText = {
    Main(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="text2" {...props} />
    },
    Link(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="primary1" {...props} />
    },
    Black(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="black" {...props} />
    },
    White(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="white" {...props} />
    },
    Body(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={400} fontSize={'1.6rem'} color="text1" {...props} />
    },
    Basic(props: TextProps): ReactElement {
        return <TextWrapper {...props} />
    },
    Header(props: TextProps): ReactElement {
        return <TextWrapper fontSize={'10rem'} letterSpacing={7} fontWeight={500} fontStyle={'italic'} {...props} />
    },
    SubHeader(props: TextProps): ReactElement {
        return (
            <TextWrapper fontSize={'1.8rem'} padding={2} margin={'2rem 0'} fontWeight={500} fontStyle={'italic'} {...props} />
        )
    },
    LargeHeader(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={600} fontSize={'2.4rem'} {...props} />
    },
    MediumHeader(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} fontSize={'2rem'} {...props} />
    },
    Small(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} fontSize={'1.1rem'} {...props} />
    },
    Blue(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="primary1" {...props} />
    },
    Yellow(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="yellow1" {...props} />
    },
    DarkGray(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="text3" {...props} />
    },
    Gray(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color="bg3" {...props} />
    },
    Italic(props: TextProps): ReactElement {
        return <TextWrapper fontWeight={500} fontSize={'1.2rem'} fontStyle={'italic'} color="text2" {...props} />
    },
    Error({ error, ...props }: { error: boolean } & TextProps): ReactElement {
        return <TextWrapper fontWeight={500} color={error ? 'red1' : 'text2'} {...props} />
    },
}
