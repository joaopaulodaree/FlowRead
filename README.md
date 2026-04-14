# FlowRead

FlowRead é um leitor de artigos construído com **Next.js** e **Pretext**, com foco em melhorar a experiência de leitura de conteúdos longos.  
A proposta do projeto é reduzir *layout shift*, prever melhor a altura de blocos de texto e tornar a leitura mais fluida e perceptivamente estável.

## Demonstração

A aplicação está disponível em produção:

**Deploy:** https://flow-read-dusky.vercel.app/

## Objetivo

Em interfaces de leitura longa, mudanças inesperadas no layout prejudicam a percepção de fluidez e a experiência do usuário.  
O FlowRead busca minimizar esse problema por meio de medições e estimativas de conteúdo textual, permitindo uma renderização mais previsível.

## Principais ideias do projeto

- Leitura fluida de artigos em formato longo
- Redução de *layout shift* durante a renderização
- Previsão de altura de blocos de texto
- Melhor percepção de performance na leitura
- Cache de medições para evitar processamento desnecessário

## Tecnologias utilizadas

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Pretext** (`@chenglou/pretext`)
- **react-markdown**
- **next-themes**

## Estrutura do projeto

```bash
FlowRead/
├── app/
├── components/
├── lib/
├── next.config.js
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```