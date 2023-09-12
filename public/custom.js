 // Download PDF using printThis when the button is clicked
 $(document).ready(function(){
    $('#btn-Download').click(function(){
        $('#output').printThis({
            header: null,  // Remove headers from the printed PDF
            footer: null,  // Remove footers from the printed PDF
        });
    });
});