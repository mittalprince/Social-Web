$(document).ready(function (){

    $.get('/profile/detail', (user)=>{
        console.log(user);
        if(user.errorExist){
            alert(user.message);
            if (user.loggedIn)window.location.reload(true);
            else window.location.assign('/login')
        }
        else if(user.username){

        }
        else{
            // window.location.assign('/login')
        }
    });

})