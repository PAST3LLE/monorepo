import { ThemeProvider, createPast3lleTemplateTheme } from '@past3lle/theme'
import React, { ReactNode } from 'react'

const theme = createPast3lleTemplateTheme('PASTELLE')

export default ({ children }: { children: ReactNode }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>
