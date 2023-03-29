import React from 'react'
import { Helmet } from 'react-helmet'

export const RobotoVariableFontProvider = () => {
  return (
    <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Flex:slnt,wdth,wght,GRAD,YOPQ,YTAS,YTDE@0,100,300,0,79,750,-203;-10,127.8,100,-200,79,854,-305;-10,127.8,100,-200,97,854,-305;-10,127.8,100,0,79,750,-203&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  )
}
