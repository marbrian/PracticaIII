const juego = new Vue({
    el: "#juego",
    data:{
        url: 'https://jsonplaceholder.typicode.com/users',
        personas: [],
        resultado: [],
        orden: [],
        habilitado: [],
        mensaje: '',
        mensaje_ordenado: 'Está ordenado. ÉXITO',
        estado: 'Comienza!',
        gana: new Audio('audios/gana.mp3'),
        sonido_error: new Audio('audios/intento.mp3'),
        pierde: new Audio('audios/pierde.mp3'),
        showModal: false,
        fin: false,
        mensaje_error: '',
        errores: 0,
    },

    mounted(){
        persona = [];
        axios.get(this.url)
            .then(respuesta => {
                res = respuesta.data;
                for (let i = 0; i < res.length; i++) {
                    this.personas.push(res[i].username);
                    this.habilitado[i] = true;
                }

                this.orden = this.personas.slice();
                this.orden.sort();

                this.personas.sort(function() { 
                    return Math.random() - 0.1 
                });
            })
            .catch(error => console.log(error));
    },

    methods:{
        pasar(nombre){
            //Pasar cada nombre al nuevo array y deshabilitar el botón correspondiente
            indice = this.resultado.length;
            persona = this.orden[indice];
            if (nombre === persona) {
                this.resultado.push(nombre);
                this.mensaje_error = '';
                for (let i = 0; i < this.personas.length; i++) {
                    if (this.personas[i] === nombre) {
                        this.habilitado[i] = false;
                    }
                }
            }else{
                this.mensaje_error = 'El nombre seleccionado no va en esa posición';
                this.error = this.errores + 1;
                this.sonido_error.play();
            }
        },

        rejugar(){
            //Devuelvo los valores originales a las variables
            this.resultado = [];
            this.errores = 0;
            this.mensaje = '';
            this.estado = 'Comienza!';
            this.fin = false;

            for (let i = 0; i < this.habilitado.length; i++) {
                this.habilitado[i] = true;
            }

            this.personas.sort(function() { 
                return Math.random() - 0.1
            });
        },

        mostrarReglas(){
            this.showModal = true;
        },

        verificar(array1,array2) {
            return array1.toString() === array2.toString(); 
        },
    },

    watch:{
        resultado(nuevo, antiguo){
            // Si el rango del array resultado es menor a 10, que me muestre el mensaje de continuar
            if((nuevo.length > 0) && (nuevo.length < this.personas.length)){
                this.estado = "Continua...";
                return false;
            } else if (nuevo.length == 0){
                this.estado = "Comienza!";
                return false;
            } else {
                this.estado = "Lista llena.";
                this.fin = true;
            }

            //Si fin es TRUE, comparar los arrays y mostrar el mensaje correspondiente
            if (this.fin && this.verificar(nuevo, this.orden)) {
                this.mensaje = this.mensaje_ordenado;
                alert('¡Excelente, la lista está ordenada!');
                this.gana.play();
            } else {
                this.mensaje = '';
            }

        }

    }
});