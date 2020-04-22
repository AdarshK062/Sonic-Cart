$(document).ready(function(){
    
    $('#like').on('click', function(e){
        e.preventDefault();
        
        var id = $('#id').val();
        var productName = $('#product_Name').val();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                productName: productName,
                like: "true"
            },
            success: function(){
                // //console.log(clubName);
            }
        })
        
    });
    $('#cart').on('click', function(e){
        e.preventDefault();
        
        var id = $('#id').val();
        var productName = $('#product_Name').val();

        $.ajax({
            url: '/home',
            type: 'POST',
            data: {
                id: id,
                productName: productName,
                cart: "true"
            },
            success: function(){
                // //console.log(clubName);
            }
        })
        
    });
});