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

    if(respostas.length == 0){
        console.log("Nenhma meta selecionada!")
        return       
    }

    metas.forEach((m) => {
        m.checked = false
    })

    respostas.forEach((respostas) => {
        const meta = metas.find((m) => {
            return m.value == respostas
        })

        meta.checked = true
        
    })

    console.log("Metas marcadas como concluídas!")
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
            case "sair":
                console.log("Até a próxima")
                return
        }
    }
}

start()
