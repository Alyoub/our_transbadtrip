import { log } from "console";

export const updateHomeHeadermain5 = () => {
    const main5 = [{
        title : 'Get started',
        key1 : 'Play Online',
        key2 : 'Invite friends'
    },
    {
        title : 'Account',
        key1 : 'Join',
        key2 : 'Play & explore'
    },
    {
        title : 'PingPong.io',
        key1 : 'Support',
        key2 : 'Sign up'
    }]
    
    
    let htmlGen1 = '';
    
    main5.forEach((main5)=>{
        
        htmlGen1 += `
        <div class="wq1">
        <p class="xp1">
        ${main5.title}
        </p>
        <p class="xr1">
        ${main5.key1}
        </p>
        <p class="xr1">
        ${main5.key2}
        </p>
        </div>
        `
    });
    
    const element = document.querySelector('.js-wq1');
    if (element) {
        element.innerHTML = htmlGen1;
    }
    
    // console.log(htmlGen1);
};

export const setupLoginPage = () => {
    const hengSingUP = `
    <form class="loginUpForm">
    <div class="login_name_lastName">
    <div class="login_user_name">
    <p class="login_name">
    Name
    </p>
    <input type="text" class="input_login_name" required>
    <p class="checkRegesterName">
        
    </p>
    </div>
    <div class="login_user_Lastname">
    <p class="login_Lastname">
    Last Name
    </p>
    <input type="text" class="input_login_Lastname" required>
    <p class="checkRegesterLastname">
        
    </p>
    </div>
    </div>
    <div class="username_login2_info">
    <p class="username_login2_Text">
    Username
    </p>
    <input class="input_login_Username" type="text" required>
    <p class="checkRegesterUserName">

    </p>
    </div>
    <div class="email_login2_info">
    <p class="email_login2_Text">
    Email
    </p>
    <input class="input_login_Email" type="text" required>
    <p class="checkRegesterEmail">
    
    </p>
    </div>
    <div class="Password_input_info">
    <p class="Password_Text">
    Password
    </p>
    <div class="password_input">
    <input class="login_input_password1" type="password" required>
    <span class="show_bt1">
    <img class="Show" src="../public/logos/eye_off.svg">
    </span>
    <p class="checkRegesterPassword">

    </p>
    </div>
    </div>
    <div class="Password_input_info">
    <p class="Password_Text">
    Confirm Password
    </p>
    <div class="password_input">
    <input class="login_input_password2" type="password" required>
    <span class="show_bt2">
    <img class="Show" src="../public/logos/eye_off.svg">
    </span>
    <p class="checkRegesterConfirmPassword">

    </p>
    </div>
    </div>
    <div class="PadSingbt">
        <button id="sing_IN" class="SIGN_BT_IN">
        SIGN IN
        </button>
    </div>
    </form>
    `;
    
    const hengSingIN = `
    <form class="loginInForm">
    <div class="email_login_info">
    <p class="Email_Text">
    Email
    </p>
    <input class="login_input_email" type="text">
    <p class="checkLoginEmail">

    </p>
    </div>
    <div class="Password_input_info">
    <p class="Password_Text">
    Password
    </p>
    <div class="password_input">
    <input class="login_input_password" type="password">
    <span class="show_bt">
    <img class="Show" src="../public/logos/eye_off.svg">
    </span>
    <p class="checkLoginPassword">
    
    </p>
    </div>
    </div>
    <div class="remmber_me">
    <div class="check_box">
    <input class="login_checkbox" type="checkbox">
    <lapel class="remmberME">
        Remmber me?
    </lapel>
    <label class="Forgot_password">
    Forgot password?
    </label>
    </div>
    </div>
    <button class="SIGN_BT_UP">
    SIGN IN
    </button>
    <p class="or_use">
    OR USE
    </p>
    <div class="padGoogleBt">
        <button id="googleBT" class="GOOGLE_BT">
        <img src="../public/logos/google_logo.svg" class="google">
        </button>
    </form>
    `;

    function bluringHome(SignUpBt : string)
    {
        const homeLoginbtn = document.getElementById(SignUpBt) as HTMLButtonElement;
        const AllHomePage = document.getElementById('all_Home_page') as HTMLElement;
        const loginPgae = document.getElementById('loginPage') as HTMLElement;
        const Exitbt = document.getElementById('exitLogin') as HTMLButtonElement;
        const SingInLoginbt = document.querySelector('.SING_IN') as HTMLButtonElement;
        // const SingInHomebt = document.getElementById('Sing_upHomeBt') as HTMLButtonElement;


        const SING_IN = document.querySelector('.SING_IN');
        const SING_UP = document.querySelector('.SING_UP');
        let user_login_info = document.querySelector('.user_login_info');

        loginPgae.classList.add('hide');

        homeLoginbtn.addEventListener('click', () => {
           
           if(SignUpBt === "loginPageBtn" || SignUpBt === "loginPageBtn1" || SignUpBt === "loginPageBtn2") //log in home btn
           {
                AllHomePage.classList.add('blur');
                loginPgae.classList.remove('hide');
                SING_UP?.classList.remove('line');
                SING_IN?.classList.add('line');
                user_login_info!.innerHTML = hengSingIN;
                toggleVisibility('.login_input_password', '.show_bt');
                checkLastInput('.login_input_email','.checkLoginEmail', /^[a-zA-Z0-9._%+-@]*$/); //for sign in email input
                checkLastInput('.login_input_password', '.checkLoginPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign in password input
                 
                
                getSignInData();
           }
           else if(SignUpBt === "Sing_upHomeBt") //Sing UP home btn
           {
                AllHomePage.classList.add('blur');
                loginPgae.classList.remove('hide');
                SING_IN?.classList.remove('line');
                SING_UP?.classList.add('line');
                user_login_info!.innerHTML = hengSingUP;
                toggleVisibility('.login_input_password1', '.show_bt1');
                toggleVisibility('.login_input_password2', '.show_bt2');

                checkLastInput('.input_login_Username','.checkRegesterUserName', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up userName input
                checkLastInput('.input_login_Email','.checkRegesterEmail', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up email input
                checkLastInput('.input_login_name','.checkRegesterName', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up Name input
                checkLastInput('.input_login_Lastname','.checkRegesterLastname', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up last name input
                
                checkLastInput('.login_input_password1','.checkRegesterPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up Password input
                checkLastInput('.login_input_password2','.checkRegesterConfirmPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up confirm Password input

                // checkInput('.input_login_Email',
                // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // for sing Up email input safty
                // checkInput('.login_input_password1',
                // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // for sing Up Password input safty
                // checkInput('.login_input_password2',
                // /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/); // for sing Up Confirm Password input safty

                
                
                getSingUpData(); //check if user name is empty
           }

        });
        
        SING_IN?.addEventListener('click', () => {
            SING_UP?.classList.remove('line');
            user_login_info!.innerHTML = hengSingIN;
            SING_IN?.classList.add('line');
            toggleVisibility('.login_input_password', '.show_bt');
            checkLastInput('.login_input_email','.checkLoginEmail', /^[a-zA-Z0-9._%+-@]*$/); //for sign in input
            checkLastInput('.login_input_password', '.checkLoginPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign in password 
            
            getSignInData();
                    
        });

        SING_UP?.addEventListener('click', () => {
            SING_IN?.classList.remove('line');
            user_login_info!.innerHTML = hengSingUP;
            SING_UP.classList.add('line');
            toggleVisibility('.login_input_password1', '.show_bt1');
            toggleVisibility('.login_input_password2', '.show_bt2');

            checkLastInput('.input_login_Username','.checkRegesterUserName', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up userName input
            checkLastInput('.input_login_Email','.checkRegesterEmail', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up email input
            checkLastInput('.input_login_name','.checkRegesterName', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up Name input
            checkLastInput('.input_login_Lastname','.checkRegesterLastname', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up last name input
            checkLastInput('.login_input_password1','.checkRegesterPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up Password input
            checkLastInput('.login_input_password2','.checkRegesterConfirmPassword', /^[a-zA-Z0-9._%+-@]*$/); //for sign Up confirm Password input
            
            getSingUpData(); //check if user name is empty
        });

        Exitbt.addEventListener('click', () => {
            AllHomePage.classList.remove('blur');
            loginPgae.classList.add('hide');
        });


    }
    bluringHome('loginPageBtn');
    bluringHome('loginPageBtn1');
    bluringHome('loginPageBtn2');
    bluringHome('Sing_upHomeBt');

    const toggleVisibility = (inputSelector: string, buttonSelector: string) => {
        // console.log(document.querySelector("span.show_bt1"));

        const on = '<img class="Show" src="../public/logos/eye_on.svg">';
        const off = '<img class="Show" src="../public/logos/eye_off.svg">';
        const check_input = document.querySelector(inputSelector) as HTMLInputElement;
        let input = document.querySelector(buttonSelector) as HTMLSpanElement;
        
        if (!check_input || !input) return;
        
        input.addEventListener('click', (event) => {
            event.preventDefault();

            if (check_input.type === "password")
            {
                input.innerHTML = on;
                check_input.type = "text";
            }
            else
            {
                input.innerHTML = off;
                check_input.type = "password";
            }
            
        });
    };

    // function checkInput(selector: string, pattern: RegExp)
    // {
    //     const input = document.querySelector(selector) as HTMLInputElement;

    //     const showbt1 = document.querySelector('.show_bt1') as HTMLButtonElement; 
    //     const showbt2 = document.querySelector('.show_bt2') as HTMLButtonElement; 


    //     if (!input) return;
    
    //     input.addEventListener("input", () => {
    //         const val = input.value;

    //         if (!pattern.test(val))
    //         {
    //             input.classList.remove('valid');
    //             input.classList.add('invalid');

    //             if(selector === ".login_input_password1")
    //             {
    //                 showbt1.classList.remove('validBT');
    //                 showbt1.classList.add('invalidBT');
    //             }
    //             if(selector === ".login_input_password2")
    //             {
    //                 showbt2.classList.remove('validBT');
    //                 showbt2.classList.add('invalidBT');
    //             }
    //         }
    //         else 
    //         {
    //             input.classList.remove('invalid');
    //             input.classList.add('valid');

    //             if(selector === ".login_input_password1")
    //             {
    //                 showbt1.classList.remove('invalidBT');
    //                 showbt1.classList.add('validBT');
    //             }
    //             if(selector === ".login_input_password2")
    //             {
    //                 showbt2.classList.remove('invalidBT');
    //                 showbt2.classList.add('validBT');
    //             }
    //         }
    //     });
    // }
    
    function checkLastInput(selector: string, checekr :string, pattern: RegExp)
    {
        const input = document.querySelector(selector) as HTMLInputElement;
        const inputreader = document.querySelector(checekr) as HTMLElement;

        if (!input) return;
    
        input.addEventListener("input", () => {
            const lastChar = input.value.slice(-1);

            if (!pattern.test(lastChar))
                inputreader.innerHTML = `Invalid character: ${lastChar}`;
            else
                inputreader.innerHTML = '';
        });
    }


    function getSingUpData()
    {
        const SingUpBt = document.getElementById('sing_IN') as HTMLButtonElement;

        SingUpBt.addEventListener('click', (event) => {
            event.preventDefault();

            const name = document.querySelector('.input_login_name') as HTMLInputElement;
            const lastname = document.querySelector('.input_login_Lastname') as HTMLInputElement;
            const username = document.querySelector('.input_login_Username') as HTMLInputElement;
            const email = document.querySelector('.input_login_Email') as HTMLInputElement;
            const password = document.querySelector('.login_input_password1') as HTMLInputElement;
            const confirmPassword = document.querySelector('.login_input_password2') as HTMLInputElement;


            const nameMsg = document.querySelector('.checkRegesterName') as HTMLInputElement;
            const lastnameMsg = document.querySelector('.checkRegesterLastname') as HTMLInputElement;
            const usernameMsg = document.querySelector('.checkRegesterUserName') as HTMLInputElement;
            const emailMsg = document.querySelector('.checkRegesterEmail') as HTMLInputElement;
            const passwordMsg = document.querySelector('.checkRegesterPassword') as HTMLInputElement;
            const confirmPasswordMsg = document.querySelector('.checkRegesterConfirmPassword') as HTMLInputElement;

            const showbt1 = document.querySelector('.show_bt1') as HTMLButtonElement; 
            const showbt2 = document.querySelector('.show_bt2') as HTMLButtonElement; 


            if(name.value.trim() === "" || lastname.value.trim() === "" || username.value.trim() === ""
             || email.value.trim() === "" || password.value.trim() === "" || confirmPassword.value.trim() === "")
            {
                if(name.value.trim() === "" )
                {
                    name.classList.add('invalid');
                    nameMsg.innerHTML = "Required Fild";
                    
                }
                if(lastname.value.trim() === "" )
                {
                    lastname.classList.add('invalid');
                    lastnameMsg.innerHTML = "Required Fild";
                }
                if(username.value.trim() === "")
                {
                    username.classList.add('invalid');
                    usernameMsg.innerHTML = "Required Fild";
                }
                if(email.value.trim() === "")
                {
                    email.classList.add('invalid');
                    emailMsg.innerHTML = "Required Fild";
                }
                if(password.value.trim() === "")
                {
                    password.classList.add('invalid');
                    showbt1.classList.add('invalidBT');
                    passwordMsg.innerHTML = "Required Fild";
                }
                if(confirmPassword.value.trim() === "")
                {
                    confirmPassword.classList.add('invalid');
                    showbt2.classList.add('invalidBT');
                    confirmPasswordMsg.innerHTML = "Required Fild";
                }
            }
            else if(name.value.trim() !== "" && lastname.value.trim() !== "" && username.value.trim() !== ""
             && email.value.trim() !== "" && password.value.trim() !== "" && confirmPassword.value.trim() !== "")
            {
                if(password.value === confirmPassword.value)
                {
                    // confirmPassword.classList.remove('invalid');
                    // confirmPassword.classList.remove('invalidBT');

                    const formSignUPData = {
                        name: name.value,
                        lastname: lastname.value,
                        username: username.value,
                        email: email.value,
                        password: password.value,
                        confirmPassword: confirmPassword.value
                    };
                    console.log(formSignUPData);
                }
                else
                {
                    confirmPassword.classList.add('invalid');
                    showbt2.classList.add('invalidBT');
                    confirmPasswordMsg.innerHTML = "Password mismatch.";
                }
            }

            const inputs: HTMLInputElement[] = [
                document.querySelector('.input_login_name') as HTMLInputElement,
                document.querySelector('.input_login_Lastname') as HTMLInputElement,
                document.querySelector('.input_login_Username') as HTMLInputElement,
                document.querySelector('.input_login_Email') as HTMLInputElement,
                document.querySelector('.login_input_password1') as HTMLInputElement,
                document.querySelector('.login_input_password2') as HTMLInputElement
            ];
            
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    input.classList.remove('invalid');
            
                    if (input.classList.contains('login_input_password1'))
                    {
                        showbt1.classList.remove('invalidBT');
                    }
                    if(input.classList.contains('login_input_password2'))
                    {
                        showbt2.classList.remove('invalidBT');
                    }
                });
            });
            
            // fetch ('http://10.11.2.4:3000/register', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(
            //         UserSignUpData
            //     )
            // })
            // .then(response => response.json()) // Parse JSON response
            // .then(data => console.log('Success:', data)) // Handle success
            // .catch(error => console.error('Error:', error)); // Handle errors



        });
    };

    const getSignInData = () => {
        
        const SingInBt = document.querySelector('.SIGN_BT_UP') as HTMLButtonElement;

        SingInBt?.addEventListener('click', (event) => {
            event.preventDefault();


            const email = document.querySelector('.login_input_email') as HTMLInputElement;
            const password = document.querySelector('.login_input_password') as HTMLInputElement;


            const emailMSG = document.querySelector('.checkLoginEmail') as HTMLElement;
            const passwordMSG = document.querySelector('.checkLoginPassword') as HTMLElement;

            const showbt = document.querySelector('.show_bt') as HTMLButtonElement; 

            
            if(email.value.trim() === "" || password.value.trim() === "")
            {
                if(email.value.trim() === "" )
                {
                    email.classList.add('invalid');
                    emailMSG.innerHTML = "Required Fild";
                }
                if(password.value.trim() === "" )
                {
                    password.classList.add('invalid');
                    showbt.classList.add("invalidBT");
                    passwordMSG.innerHTML = "Required Fild";
                }
            }
            else if(email.value.trim() !== "" && password.value.trim() !== "")
            {
                const formSignINData = {
                    email : email.value,
                    password : password.value
                }
                console.log(formSignINData);
            }
            const inputs: HTMLInputElement[] = [
                document.querySelector('.login_input_email') as HTMLInputElement,
                document.querySelector('.login_input_password') as HTMLInputElement,
            ];
            
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    input.classList.remove('invalid');
            
                    if (input.classList.contains('login_input_password'))
                    {
                        showbt.classList.remove('invalidBT');
                    }
                });
            });
            // fetch ('http://10.11.2.4:3000/login', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(
            //         formInData
            //     )
            // })
            // .then(response => response.json()) // Parse JSON response
            // .then(data => console.log('Success:', data)) // Handle success
            // .catch(error => console.error('Error:', error)); // Handle errors
        });
    };

    // function googleCNCT()
    // {
    //     const googlBt = document.getElementById('googleBT') as HTMLButtonElement;

    //     googlBt.addEventListener('click', () => {

    //     });
    // }
    // googleCNCT();

}
