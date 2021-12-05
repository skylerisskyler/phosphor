import './style.css'


const ws: WebSocket = new WebSocket('ws://localhost:8765')





const lights = document.querySelector<HTMLDivElement>('#lights')!

// // const createLight = (id: number, name: string) => {
// //   return document.createElement(`<div id="${id}"">${name}</div>`)
// // }

const light = document.createElement('li')
// // light.setAttribute('background-color', 'black')

lights.appendChild(light);


// const colors: string[] = [
//   'black',
//   'orange',
//   'green',
//   'purple',
//   'pink',
//   'brown',
//   'magenta',
//   'cyan',
//   'yellow'
// ]

// function sleep(ms: number) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }


// async function main() {

//   for (let i = 0; i < colors.length; i++) {
//     const color = colors[i]
//     light.style.setProperty('background-color', color)
//     await sleep(500)
//   }

// }

// main()


ws.onopen = (event: Event) => {
  console.log('connected to websocket')
  ws.send('hello python')
}


ws.onmessage = (event: Event) => {
  light.style.setProperty('background-color', (event as any).data)
}