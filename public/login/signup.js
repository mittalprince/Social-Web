
$(document).ready(function (){
    
    let user_username= $('#username');
    let user_name= $('#name');
    let user_email= $('#email');
    let user_password= $('#password');
    let signup_btn= $('#signup_btn');

    signup_btn.click(function(){
        let user={};
        user.username = user_username.val().trim();
        user.name = user_name.val().trim();
        user.email = user_email.val().trim();
        user.password= user_password.val();

        if((user.username!=='') && (user.name!=='') && (user.email!=='') && (user.password!=='')){
            
            if(!checkValidation(user.email)){
                $('#email').addClass("is-invalid")
            }
            else{
                $('#email').removeClass("is-invalid");
            
                $.ajax({
                    url: '/signup',
                    type: 'POST',
                    data: {
                        user:user
                    },
                    success: (user)=>{
                        // console.log(user);
                        if(user){
                            alert(`Welcome ${user.username}, Please Login to continue`);
                            window.location.href='/';
                        } else {
                            alert('User already exists. Please Signup with a different username or email');
                            window.location.href= './signup.html';
                        }
                    }
                });
            }
        }
    })

    function checkValidation(email){
        if (email.match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
            return false;
        }
        return true;
    }
})