// Chave para identificar os dados salvos pela nossa aplicação no navegador
const STORAGE_KEY = "prompts_storage"

//Estado carregar os prompts salvos e exibir
const state = {
  prompts: [],
  selectedId: null, 
}



// Seletores dos elementos HTML por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
  btnSave: document.getElementById("btn-save"),
  list: document.getElementById("prompt-list"),
  search: document.getElementById("search-input"),
  btnNew: document.getElementById("btn-new"),
  btnCopy: document.getElementById("btn-copy"),
}

// Atualiza o estado do wrapper conforme o conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0
  wrapper.classList.toggle("is-empty", !hasText)
}

// Funções para abrir e fechar a sidebar
function openSidebar() {
  elements.sidebar.style.display = "flex"
  elements.btnOpen.style.display = "none"
}

function closeSidebar() {
  elements.sidebar.style.display = "none"
  elements.btnOpen.style.display = "block"
}

// Atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

// Adiciona ouvintes de input para atualizar wrappers em tempo real
function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener("input", function () {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })

  elements.promptContent.addEventListener("input", function () {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
}

function save(){
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()// innerHTML para manter a formatação do conteudo
  const hasContent = elements.promptContent.textContent.trim()

  if(!title && !hasContent){
    alert("Por favor, adicione um título ou conteúdo ao prompt antes de salvar.")
    return
  }
if(state.selectedId){
  //Edição de prompt existente
  const existentePrompt = state.prompts.find((p) => p.id === state.selectedId) // Encontra o prompt existente pelo ID selecionado
  if(existentePrompt){
    existentePrompt.title = title || "Sem título" // Se o título estiver vazio, atribui "Sem título"
    existentePrompt.content = content || "Sem conteúdo" // Se o conteúdo estiver vazio, atribui "Sem conteúdo"
  }
} else{
  //Criação de novo prompt
  const newPrompt = {
    id: Date.now().toString(), // Gera um ID único baseado no timestamp atual, toString converte no caso a data para texto, uma string
    title,
   content,
  }
  state.prompts.unshift(newPrompt) // unshifth:Adiciona o novo prompt no início da lista
  state.selectedId = newPrompt.id // Seleciona o novo prompt


}
renderList(elements.search.value) // Re-renderiza a lista com o filtro atual
persist()
console.log("Prompt salvo com sucesso!")
  
}


function persist (){ // try catch se entrar no try deu certo, se der erro entra no catch
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts)) // JSON.stringify converte o array em string para salvar no localStorage 
  } catch (error) {
    console.log("Erro ao salvar no armazenamento local:", error)
    
  }
}

function load(){
 try {
  const storage = localStorage.getItem(STORAGE_KEY)
  state.prompts = storage ? JSON.parse(storage) : [] // se tiver algo no storage, converte de volta para array com JSON.parse, se não tiver nada, inicializa como array vazio
  state.selectedId= null
 } catch (error) {
  console.log("Erro ao carregar do armazenamento local:", error)
  
 }
}
 
 
function createPromptListItem(prompt) {
  const tmp = document.createElement("div")
  tmp.innerHTML = prompt.content || "" // evita "undefined" e permite remover HTML
  return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
      <div class="prompt-item-content">
        <span class="prompt-item-title">${prompt.title}</span>
        <span class="prompt-item-description">${tmp.textContent}</span>
      </div>
      <button class="btn-icon" title="Remover" data-action="remove">
        <img src="assets/remove.svg" alt="Remover" class="icon icon-trash" />
      </button>
    </li>
  `
}

        


function renderList(filterText = "") { 
const filteredPrompts = state.prompts.filter((prompt) =>
  prompt.title.toLowerCase().includes(filterText.toLowerCase().trim()) 
).map((prompt) => createPromptListItem(prompt)).join("")

elements.list.innerHTML = filteredPrompts

}

function add() {
  state.selectedId = null
  elements.promptTitle.textContent = ""
  elements.promptContent.innerHTML = ""
  updateAllEditableStates()
  elements.promptTitle.focus() // Coloca o foco no título para facilitar a digitação
} 

function copySelected() {
  try {
    const content = elements.promptContent
     navigator.clipboard.writeText(content.innerText) // Copia o texto para a área de transferência
     alert("Conteúdo copiado para a área de transferência!")
  } catch (error) {
    console.error("Erro ao copiar para a área de transferência:", error)
    
  }
}
      




// Evento dos botões
elements.btnSave.addEventListener("click", save)
elements.btnNew.addEventListener("click", add)
elements.btnCopy.addEventListener("click", copySelected)
elements.search.addEventListener("input", function (event) {
renderList(event.target.value)
})


elements.list.addEventListener("click", function (event) {
  const removeBtn = event.target.closest('button[data-action="remove"]')
  const item = event.target.closest("[data-id]")
  if (!item) return

  const id = item.getAttribute("data-id")
  state.selectedId = id

  if (removeBtn) { // Se o botão de remover foi clicado
    state.prompts = state.prompts.filter((p) => p.id !== id)
    renderList(elements.search.value) // Re-renderiza a lista com o filtro atual
    persist() // Salva as mudanças
    return
  }

  if (event.target.closest("[data-action='select']")) {
    const prompt = state.prompts.find((p) => p.id === id)

    if (prompt) {
      elements.promptTitle.textContent = prompt.title
      elements.promptContent.innerHTML = prompt.content || ""
      updateAllEditableStates()
    }
  }
})


// Inicialização
function init() {
  load()
  renderList("")
  attachAllEditableHandlers()
  updateAllEditableStates()

  // Estado inicial: sidebar aberta, botão de abrir oculto
  elements.sidebar.style.display = ""
  elements.btnOpen.style.display = "none"

  // Eventos para abrir/fechar sidebar
  elements.btnOpen.addEventListener("click", openSidebar)
  elements.btnCollapse.addEventListener("click", closeSidebar)
}

// Executa a inicialização ao carregar o script
init()