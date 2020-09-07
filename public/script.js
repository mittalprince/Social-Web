$(document).ready(function (){

    $.get("/profile/verify_user", function(data){
        if(data){

        }
        else{
            
        }
    });

    $.get("/posts/all", (posts)=>{
        console.log(posts);
    })
})