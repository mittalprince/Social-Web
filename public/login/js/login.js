$(document).ready(function (){

    $.get("/profile/verify_user", function (data){
        console.log(data);
        if (data) {
            alert(`${data.username}, you are already logged in.`)
            window.location.assign('/');
        }
    });

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
                console.log(user);
                if(user.errorExist){
                    alert(user.message);
                    window.location.reload(true);
                } else {
                    alert(`Welcome ${user.username}, You have successfully logged in.`);
                    window.location.assign('/');
                }
            })
        }
        else{
            alert("Enter valid username or password")
        }
    })

})