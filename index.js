const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let mensagem = "Bem-vindo ao App de Metas"

let metas = []

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}
  
const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))    
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "Cadastrar meta: "})

    if(meta.length == 0){
        mensagem = "A meta não pode ser vazia."
        return
    }

    metas.push(
        {value: meta, checked: false}
    )

    mensagem = "Meta cadastrada com sucesso!"
}

const listarMetas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }

    const respostas = await checkbox({
        message: "Use as setas para selecionar, o espaço para marcar/desmarcar e o Enter para finalizar",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        mensagem = "Nenhuma meta selecionada!"
        return       
    }

    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        })
        meta.checked = true        
    })
    mensagem = "Meta(s) marcada(s) como concluídas!"
}

const metasRealizadas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const realizadas = metas.filter((meta) => { //filter: sempre que o return for verdadeiro pega o parametro "meta" e colocar em uma nova lista 
        return meta.checked
    })

    if(realizadas.length == 0){
        mensagem = "Não existem metas realizadas! :(" 
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas] 
    })
}

const metasAbertas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    if(abertas.length == 0){
        mensagem = "Não exitem metas abertas! :) " 
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    if(metas.length == 0){
        mensagem = "Não existem metas"
        return
    }
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })
    const itensADeletar = await checkbox({
        message: "Selecione para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0){
        mensagem =  "Nenhum item para deletar."
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
        mensagem = "Meta(s) removida(s) com sucesso!"
    })
}

const mostrarMensagem = () => {
    console.clear()

    if(mensagem != ""){
        
        console.log("")
        console.log(mensagem)
        console.log("")
        mensagem = ""
    }
}

const start = async () => {
    carregarMetas()   
            
    while(true){
        mostrarMensagem()
        await salvarMetas()

        const opcao = await select({
            message: "Menu >>",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "cadastrar"                    
                },
                {
                    name: "Listar metas",
                    value: "listar"                    
                },
                {
                    name: "Metas Realizadas",
                    value: "realizadas"                    
                },
                {
                    name: "Metas abertas",
                    value: "abertas"                    
                },
                {
                    name: "Deletar metas",
                    value: "deletar"                    
                },
                {
                    name: "Sair",
                    value: "sair"                    
                },
            ]
        })

        switch(opcao){
            case "cadastrar":
               await cadastrarMeta()
               
                break
            case "listar":
                await listarMetas()
                break
            case "realizadas":
                await metasRealizadas()
                break
            case "abertas":
                await metasAbertas()
                break
            case "deletar":
                await deletarMetas()
                break
            case "sair":
                console.log("Até a próxima!")
                return
        }
    }
}

start();
