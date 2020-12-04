## 1. Sobre o projeto:

Este boilerplate foi criado para ajudar a automação de desenvolvimento Web estático usando [Gulp 4](https://gulpjs.com/), Sass, PostCSS, Autoprefixer, [ESLint](https://eslint.org/), [Browserify](http://browserify.org/), [Babel](https://babeljs.io/) (Babelify) e [Husky](https://github.com/typicode/husky).

O projeto já conta com uma estrutura pronta para facilitar o desenvolvimento, contando com estruturas para o Sass, modularização do JavaScript e componentização do HTML, além do plugin [Tiny Slider 2](http://ganlanyuan.github.io/tiny-slider/) para a criação de carousels (sem dependência do jQuery) e o [Bootstrap Grid](https://getbootstrap.com/docs/4.1/layout/grid/) para criação de grids responsivos.

Basta acessar o diretório `src` que fica na raíz do projeto e começar a utilizar a estrutura pronta que o projeto disponibiliza para você para desenvolver! 

## 2. Como baixar o projeto:

Abra um terminal de comandos na pasta onde deseja salvar o projeto e digite o comando abaixo:

```git
$ git clone https://github.com/jmontejr/boilerplate-web-development
```

Ou então voce pode baixar o arquivo comprimido diretamente do repositório do projeto no Github e descompactar onde desejar.

## 3. Instalando as dependências:

Entre no diretório raíz do projeto e execute no terminal o comando abaixo:

```console
$ npm install
```

## 4. Scripts de execução do projeto (npm scripts):

Os comandos abaixo podem ser encontrados no arquivo `package.json` localizado na raíz do projeto.

- Para executar os testes do ESLint execute no terminal o comando:

```console
$ npm run lint
```

- Para corrigir os erros encontrados no teste do ESLint execute no terminal o comando:

```console
$ npm run lint:fix
```

- Para remover o diretório dist (onde estão os arquivos de saída do build do projeto) execute no terminal o comando:

```console
$ npm run clean:dist
```

- Para remover o cache execute no terminal o comando:

```console
$ npm run clean:cache
```

- Para executar o build e ficar assistindo as alterações em um servidor emulado pelo **BrowserSync** execute no terminal o comando:

```console
$ npm run dev
```

- Para executar o build do projeto execute no terminal o comando:

```console
$ npm run build
```