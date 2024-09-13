const  { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3 litros de água por dia',
    checked: false
}

let metas = [ meta ]

const cadastrarMeta = async () => {
    const meta = await input({ message: "Cadastrar meta: "})

    if(meta.length == 0){
        console.log('A meta não pode ser vazia.')
        return
    }

    metas.push(
        { value: meta, checked: false}
    )
}

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para selecionar, o espaço para marcar/desmarcar e o Enter para finalizar",
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0){
        console.log("Nenhuma meta selecionada!")
        return       
    }

    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        })
        meta.checked = true        
    })
    console.log("Metas marcadas como concluídas!")
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => { //filter: sempre que o return for verdadeiro pega o parametro "meta" e colocar em uma nova lista 
        return meta.checked
    })

    if(realizadas.length == 0){
        console.log('Não existem metas realizadas! :(')
        return
    }

    await select({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [...realizadas] 
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })
    if(abertas.length == 0){
        console.log("Não exitem metas abertas! :) ")
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [...abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: meta.value, checked: false }
    })
    const itensADeletar = await checkbox({
        message: "Selecione para deletar",
        choices: [...metasDesmarcadas],
        instructions: false,
    })

    if(itensADeletar.length == 0){
        console.log("Nenhum item para deletar.")
    }

    itensADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        })
        console.log("Meta(s) removida(s) com sucesso!")
    })
}

const start = async () => {
            
    while(true){

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
               console.log(metas)
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

start()
