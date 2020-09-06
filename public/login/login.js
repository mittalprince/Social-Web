$(document).ready(function (){

    
    $("#login_btn").click(function(){

        let user_name= $('#username');
        let user_password= $('#password')

        let username= user_name.val().trim();
        let password= user_password.val();

        if((username !== "") && (password !== "")){
            
            $("#login_btn").prop('disabled', true);    
            $.post('/login',{
                username: username,
                password: password
            },function(user){
                if(!user){
                    alert('Invalid Username or Password');
                    window.location.reload(true);
                } else {
                    alert('You have successfully logged in');
                    window.location.assign('/');
                }
            })
        }
        else{
            alert("Enter valid username or password")
        }
    })

})