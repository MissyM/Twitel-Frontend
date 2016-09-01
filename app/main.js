const F = require('fractal-js')
const R = require('ramda')
const h = F.h
let fetchTask = F.tasks.fetch.types.fetch


module.exports = F.def({
  init: ({key}) => ({
    key,
    twils: [],
    mensaje: '',
    autor: ''
  }),
  load: (ctx, i, Action) => {
    i.cargarTwils(undefined)
    return {}
  },
  inputs: {
    enviarTwil: (ctx, Action, {mensaje, autor}) => ['fetch', fetchTask({
      url: 'http://localhost/twils',
      options: {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: `{
          "mensaje": "${mensaje}",
          "autor": "${autor}"
        }`,
      },
      response: r => r.json(),
      success: datos => 0,
    })],
    cargarTwils: (ctx, Action, _) => ['fetch', fetchTask({
      url: 'http://localhost/twils',
      response: r => r.json(),
      success: datos => ctx.action$(Action.CargarTwils(datos.twils))
    })],
    cambiarAutor: (ctx, Action, autor) => Action.CambiarAutor(autor),
    cambiarMensaje: (ctx, Action, mensaje) => Action.CambiarMensaje(mensaje),
  },
  actions: {
    EnviarTwil: [[], (m) => R.evolve({twils: R.append({mensaje: 'Otro twil', autor: 'Morocochó'})}, m)],
    CargarTwils: [[Array], (twils, m) => R.evolve({twils: () => twils}, m)],
    CambiarAutor: [[String], (autor, m) => R.evolve({autor: () => autor}, m)],
    CambiarMensaje: [[String], (mensaje, m) => R.evolve({mensaje: () => mensaje}, m)],
  },
  interfaces: {
    view: (ctx, i, m) => h('div', { key: m.key, class: { [styles.base]: true }}, [
      h('div', { class: {[styles.content.base]: true}}, [
        h('div', {class: {[styles.content.nombre.base]: true}}, [
          h('input', {
            class: {[styles.content.nombre.input]: true},
            on: { change: (ev) => i.cambiarAutor(ev.target.value) },
            attrs: {
              placeholder: 'Nick name',
            },
          }),
          h('div', {class: {[styles.content.sendBoton]: true}, on: {click: () => i.enviarTwil({mensaje: m.mensaje, autor: m.autor})} }, 'Enviar'),
        ]),
        h('div', {class: {[styles.content.twil.base]: true}}, [
          h('input', {
            class: {[styles.content.twil.input]: true},
            on: { change: (ev) => i.cambiarMensaje(ev.target.value) },
            attrs: {
              placeholder: 'Escribe tu twil ',
            },
          }),
        ]),
        h('div', {class: {[styles.content.actualizar.base]: true}, on: {click: i.cargarTwils}}, [
          h('img', {
            class: {[styles.content.actualizar.btn]: true},
            props: {
              src: require('./assets/update.svg'),
            },
          }),
        ]),
        h('div', {class: {[styles.content.twils.base]: true}},
          m.twils.map(twil =>  h('div', {class: {[styles.content.twils.item]: true}}, [
             h('div', {class: {[styles.content.twils.mensaje]: true}}, twil.mensaje),
             h('div', {class: {[styles.content.twils.autor]: true}}, twil.autor),
          ]))
        ),
      ]),//2
    ]),//1
  },
})


// [
//          ,
//         ]

let styles = F.css.rs({
  base: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    base: {
      display: 'flex',
      flexDirection: 'column',
      //justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#BEC0DE',
      width: '800px',
      height: '600px',
      marginTop: '15px',

    },
    nombre: {
      base:{
        display: 'flex',
        flexDirection: 'row',
        marginTop: '50px',
        width: '400px',
        height: '30px',
      },
      input: {
        width: 'calc(100% - 100px)',
        height: '30px',
      },
    },
    sendBoton: {
      padding: '5px 0px 0px 25px',
      backgroundColor: '#4823D3',
      color: '#FFFFFF',
      width: '100px',
      height: '30px',
    },
    twil: {
      base: {
       width: '400px',
       height: '100px',
      },
      input: {
       width: '400px',
       height: '100px',
      },
    },
    actualizar: {
      base: {},
      btn: {
        backgroundColor: '#DED6EE',
        width: '50px',
        height: '50px',
        padding: '5px',
        flexShrink: '0',
        marginLeft: '350px',
        '&:hover': {
          backgroundColor: '#9E9ECE',
        },
      },
    },

    twils: {
      base: {
        width: '400px',
        height: '300px',
        backgroundColor: 'white',
        overflow: 'auto',
      },
      item: {
        backgroundColor: '#EFEEF3',
        position: 'relative',
        margin: '5px',
        padding: '10px',
      },
      mensaje: {
        width: '400px',
        height: '100px',
      },
      autor: {
        paddingRight: '15px',
        textAlign: 'right',
        position: 'absolute',
        right: '10px',
        bottom: '10px',
      },

    },
  },
})
