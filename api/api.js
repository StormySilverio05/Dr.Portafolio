
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fFormulario').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        // Captura los datos del formulario
        const tutorName = document.getElementById('ftutol').value.trim();
        const clientName = document.getElementById('fpaciente').value.trim();
        const cellphone = document.getElementById('nTelefono').value.trim();
        const service = document.getElementById('fservicio').value.trim();
        const consultorio = document.getElementById('fconsultorio').value.trim();
        const date = document.getElementById('fdate').value.trim();
        const time = document.getElementById('ftime').value.trim();

        // Validación del número de teléfono
        if (!validatePhoneNumber(cellphone)) {
            alert('Por favor, introduzca un número de teléfono válido (10 dígitos numéricos).');
            return;
        }

        // Validación del rango de fecha y hora
        if (!validateDateTimeRange(date, time, consultorio)) {
            alert('Por favor, introduzca una fecha y hora válidas dentro del rango permitido.');
            return;
        }

        // Si todos los datos son válidos, procede con el envío de datos a la API
        const data = {
            tutorName: tutorName,
            clientName: clientName,
            cellphone: cellphone,
            service: service,
            consultorio: consultorio,
            date: date,
            time: time
        };

        const urlencoded = new URLSearchParams();

        const requestOptions = {
            method: "POST",
            maxBodyLength: Infinity,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'HJDUYTRGBBDGF55DSDEXCJ'

            },
            body: JSON.stringify(data), urlencoded
        };

        fetch("http://3.231.147.13:4003/enviar-whatsapp-mensaje?celular=18496376298&mensaje=*Nombre del tutor*: "
            + tutorName + "%0ANombre del paciente: " + clientName + "%0ATelefono: " + cellphone + "%0AConsultorio:" + consultorio + "%0AServicio: "
            + service + "%0AFecha: " + date + "%0AHora: " + time, requestOptions)
            .then((response) => {
                if (response.status === 200) {
                    alert("Mensaje enviado con éxito");
                } else if (response.status === 418) {
                    alert("Error: 418");
                }
                else if (response.status === 400) {
                    alert("El servidor no se encuentra actualmente disponible. Por favor, inténtelo de nuevo en un rango de 5min - 10min.");
                } else {
                    alert("Mensaje enviado con éxito");
                }
            })
            .catch((error) => {
                alert("Error de red: " + error.message);
            });
    });

    // Método para validar el número de teléfono
    function validatePhoneNumber(phone) {
        const phoneRegex = /^\d{10}$/; // Expresión regular para un número de teléfono de 10 dígitos
        return phoneRegex.test(phone);
    }
    
    function validateDateTimeRange(date, time, consultorio) {
        const dateObj = new Date(date + 'T' + time);
        const dayOfWeek = dateObj.getDay(); // 0 para domingo, 1 para lunes, etc.
        let hour = dateObj.getHours();
        const minute = dateObj.getMinutes();
        let period = 'AM'; // Inicialmente asumimos AM
    
        // Convertir a formato de 12 horas
        if (hour >= 12) {
            period = 'PM';
            if (hour > 12) {
                hour -= 12; // Convertir horas de 24 a 12 horas
            }
        }
        if (hour === 0) {
            hour = 12; // La medianoche (0 horas) debe ser 12 AM
        }
    
        // Formatear los minutos para asegurar que tenga dos dígitos
        const formattedMinute = minute < 10 ? '0' + minute : minute;
    
        const formattedTime = `${hour}:${formattedMinute} ${period}`;
    
        if (consultorio === 'COCEN') {
            // Rango para COCEN: Lunes, Martes, Miércoles, Viernes de 3 pm a 5 pm
            if ((dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 5) &&
                (period === 'PM' && hour >= 3 && hour < 5)) {
                return true;
            }
        } else if (consultorio === 'Siglo 21') {
            // Rango para Siglo 21: Lunes a Viernes de 9 am a 1 pm
            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
                // Convertir hora a formato 24 horas para comparación
                let hour24 = hour;
                if (period === 'PM' && hour !== 12) {
                    hour24 += 12;
                } else if (period === 'AM' && hour === 12) {
                    hour24 = 0;
                }
    
                // Verifica si la hora está dentro del rango de 9 am a 1 pm (13:00)
                if (hour24 >= 9 && hour24 < 13) {
                    return true;
                }
            }
        }
    
        return false;
    }

    // Método para mostrar el horario según el consultorio seleccionado
    function mostrarHorario() {
        const selectConsultorio = document.getElementById('fconsultorio');
        const selectedConsultorio = selectConsultorio.value;

        document.getElementById('horarioCOCEN').style.display = 'none';
        document.getElementById('horarioSiglo21').style.display = 'none';

        if (selectedConsultorio === 'COCEN') {
            document.getElementById('horarioCOCEN').style.display = 'block';
        } else if (selectedConsultorio === 'Siglo 21') {
            document.getElementById('horarioSiglo21').style.display = 'block';
        }
    }
});
