Swal.fire({
    type: 'success',
    text: 'Click OK to start a new game',
    title: 'Game Over',
    showCloseButton: true,
    showCancelButton: true
}).then((answer) => {
    if(answer.value) {
        Swal.fire('sure');
    } 
    
});