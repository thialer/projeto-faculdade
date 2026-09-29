# Raízes do Amanhã

Site demonstrativo de uma organização da sociedade civil, com páginas de apresentação, projetos e cadastro de voluntariado. A interface usa HTML, CSS e JavaScript sem dependências de execução; as ferramentas de build são usadas apenas para preparar a versão de produção.

## Pré-requisitos

- Node.js 18.17 ou superior e npm para gerar a versão de produção.
- Python ou a extensão Live Server do Visual Studio Code para servir os arquivos localmente.

## Instalação e execução local

Na pasta do projeto, instale as ferramentas de build e gere os arquivos de produção:

```bash
npm ci
npm run build
```

Para pré-visualizar a versão otimizada, sirva a pasta `docs`:

```bash
python -m http.server 8000 --directory docs
```

Abra `http://localhost:8000/` no navegador. Para desenvolvimento sem build, use o Live Server apontando para `html/index.html`. Abrir o arquivo diretamente pelo explorador pode impedir o carregamento correto dos recursos.

## Build de produção

O comando `npm run build` gera a versão pronta para publicação na pasta `docs/`. O processo minifica HTML, CSS e JavaScript, comprime as imagens JPEG e WebP e adapta os caminhos dos recursos para a publicação pelo GitHub Pages. A pasta `docs/` é o artefato de produção e deve acompanhar a branch de publicação.

## Estrutura

```text
html/       páginas e estrutura principal da aplicação
css/        estilos e componentes visuais
imagens/    fotografias utilizadas no site
js/         templates, navegação SPA, interações e armazenamento local
```

## Funcionalidades

- Navegação entre início, projetos e cadastro sem recarregar o documento.
- Cartões de projetos gerados a partir de dados em JavaScript.
- Cadastro com validação dos campos, máscara de telefone, CPF e CEP, e conferência dos dígitos do CPF.
- Opção de salvar projetos favoritos neste navegador. O formulário não envia nem persiste dados pessoais.
- Estados de feedback com badges, alertas, modal e toast.
- Alternância entre tema claro e escuro, seguindo a preferência do sistema na primeira visita e guardando a escolha no `localStorage`.

## Organização do JavaScript

- `js/templates.js`: conteúdo das páginas e geração dos cartões de projetos.
- `js/router.js`: navegação por hash e atualização da área principal.
- `js/main.js`: menu, modal, toast, máscaras e validação do cadastro.
- `js/storage.js`: leitura e gravação dos projetos favoritos no `localStorage`.

Os arquivos são carregados em sequência por `html/index.html`. O evento `spa:rendered` avisa os demais scripts quando uma tela foi renderizada.

## Acessibilidade incluída

A interface inclui idioma declarado em português, regiões de navegação identificadas, link para pular ao conteúdo, rótulos associados aos campos, mensagens de formulário anunciadas, foco visível e estados acessíveis nos controles. Após mudar de rota na SPA, o foco é direcionado ao conteúdo principal. Esses recursos são práticas implementadas no projeto; a conformidade completa com WCAG 2.1 AA depende de avaliação manual e com tecnologias assistivas.

O botão de tema é identificado para leitores de ecrã e pode ser usado por teclado. A escolha entre tema claro e escuro é persistida no navegador; sem preferência salva, a aplicação segue a configuração de aparência do sistema.

## Versionamento

O projeto utiliza branches `main`, `develop` e `feature/ep4-gitflow`, com mensagens de commit no padrão Conventional Commits. As versões futuras podem seguir o formato SemVer (`MAJOR.MINOR.PATCH`). Ainda não há uma release formal ou tag publicada.

## Publicação

Após integrar a branch de funcionalidade em `main`, selecione no GitHub Pages a origem `Deploy from a branch`, branch `main` e pasta `/docs`. Cada atualização publicada deve incluir uma nova execução de `npm run build` e os arquivos atualizados de `docs/`.

## Limites atuais

O cadastro é uma demonstração de interface: não há API nem envio de dados para um servidor. As imagens e os dados dos projetos são locais. Os favoritos ficam apenas no armazenamento do navegador em uso.
