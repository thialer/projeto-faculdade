# Raízes do Amanhã

Site demonstrativo de uma organização da sociedade civil, com páginas de apresentação, projetos e cadastro de voluntariado. A interface foi organizada como uma SPA simples, usando HTML, CSS e JavaScript sem dependências externas.

## Como abrir

Na pasta do projeto, inicie um servidor local. Por exemplo, com Python:

```bash
python -m http.server 8000
```

Depois, abra `http://localhost:8000/html/` no navegador. Também é possível usar a extensão Live Server do Visual Studio Code apontando para `html/index.html`. Abrir o arquivo diretamente pelo explorador pode impedir o carregamento correto dos recursos.

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

## Organização do JavaScript

- `js/templates.js`: conteúdo das páginas e geração dos cartões de projetos.
- `js/router.js`: navegação por hash e atualização da área principal.
- `js/main.js`: menu, modal, toast, máscaras e validação do cadastro.
- `js/storage.js`: leitura e gravação dos projetos favoritos no `localStorage`.

Os arquivos são carregados em sequência por `html/index.html`. O evento `spa:rendered` avisa os demais scripts quando uma tela foi renderizada.

## Acessibilidade incluída

A interface inclui idioma declarado em português, regiões de navegação identificadas, link para pular ao conteúdo, rótulos associados aos campos, mensagens de formulário anunciadas, foco visível e estados acessíveis nos controles. Após mudar de rota na SPA, o foco é direcionado ao conteúdo principal. Esses recursos são práticas implementadas no projeto; a conformidade completa com WCAG 2.1 AA depende de avaliação manual e com tecnologias assistivas.

## Versionamento

O projeto utiliza branches `main`, `develop` e `feature/ep4-gitflow`, com mensagens de commit no padrão Conventional Commits. As versões futuras podem seguir o formato SemVer (`MAJOR.MINOR.PATCH`). Ainda não há uma release formal ou tag publicada.

## Limites atuais

O cadastro é uma demonstração de interface: não há API nem envio de dados para um servidor. As imagens e os dados dos projetos são locais. Os favoritos ficam apenas no armazenamento do navegador em uso.
