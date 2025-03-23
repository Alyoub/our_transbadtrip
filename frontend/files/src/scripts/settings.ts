

export const updateSettingsPage = () => {

    let settingsCoverData = document.querySelector('.settings_cover_data') as HTMLAreaElement;

    const settingsCoverDataHTMLGen = 
    `
    <img class="settings_cover" src="/public/images/profile_cover2.png">
    <div class="settings_pic_data">
        <img class="settings_pic" src="/public/profile_pictures/abelechg.jpeg">
        <span class="online"></span>
        <label class="settings_user_name">
            Atoukmat
        </label>
        <span id="SWitchbtn" class="TwoFF">
            <img class="SwitchOFF" src="/public/logos/SwitchOFF.svg">
        </span>
        <label class="FA_TEXT">
            2FA :
        </label>
        <img class="add_sitting_cover" src="/public/logos/addPhoto.svg">
        <img class="add_sitting_pic" src="/public/logos/addPhoto.svg">
        <input class="Sitting_Uplouad_cover" type="radio">
        <input class="Sitting_Uplouad_pic" type="radio">
        <p id="fileName">
        
        </p>
    </div>
    `;

    function getFileName(InputTarget : string)
    {
        const fileInput = document.querySelector(InputTarget) as HTMLInputElement;

        fileInput.addEventListener("change", () => {
        if (fileInput.files && fileInput.files.length > 0)
        {
             const file = fileInput.files[0];
            // console.log("File Name:", file.name);
            console.log("File Path:", fileInput.value);
        }

        });
    }

    settingsCoverData!.innerHTML = settingsCoverDataHTMLGen;

    function uplouadPics(Uplouadbt: string, Inputswich: string)
    {
        const coverBtEdit = document.querySelector(Uplouadbt) as HTMLPictureElement;
        const inputUplouad = document.querySelector(Inputswich) as HTMLInputElement;

        inputUplouad.classList.add('make_uplouad_visibel');

        coverBtEdit.addEventListener('click', () => {
            // console.log('rak raya');
            if(inputUplouad.type === "radio")
            {
                inputUplouad.type = "file";
                // inputUplouad.classList.remove('make_uplouad_visibel');
                inputUplouad.click();
                getFileName(Inputswich);
            }
            else
            {
                inputUplouad.type = "radio";
                // inputUplouad.classList.add('make_uplouad_visibel');
            }
        });
    }
    

    uplouadPics('.add_sitting_cover', '.Sitting_Uplouad_cover');
    uplouadPics('.add_sitting_pic', '.Sitting_Uplouad_pic');

    const toggleVisibility = (inputSelector: string, buttonSelector: string) => {

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

    function switchbtns(butn: string, inputTag : string) {
        const btns = document.querySelectorAll(butn) as NodeListOf<HTMLButtonElement>;
        const inputs = document.querySelector(inputTag) as HTMLInputElement;
        const showPsStting = document.querySelector('.Sitting_show_btn') as HTMLButtonElement;
        const eye = document.querySelector('.show_psStiing') as HTMLElement;
        const off = '<img class="Show" src="../public/logos/eye_off.svg">';


        btns.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (btn.innerHTML.trim() === "Edit")
                {
                    btn.innerHTML = "Save";
                    btn.classList.add('save');
                    inputs.disabled = false;
                    showPsStting.disabled = false;

                } else
                {
                    btn.innerHTML = "Edit";
                    btn.classList.remove('save');
                    inputs.disabled = true;
                    showPsStting.disabled = true;
                    
                    if (inputTag === '.input_settings_password')
                    {
                        inputs.type = "password";
                        showPsStting.innerHTML = off;
                    }
                }
            });
        });
    }

    switchbtns('.bt_edit_name', '.input_settings_name');
    switchbtns('.bt_edit_User_name', '.input_settings_User_name');
    switchbtns('.bt_edit_email', '.input_settings_email');
    switchbtns('.bt_edit_password', '.input_settings_password');

    
    toggleVisibility('.input_settings_password', '.Sitting_show_btn');

    function FaSittings()
    {
        const allSittingsData = document.getElementById('All_setings_FA_data') as HTMLElement;
        const allSittingsFaData = document.querySelector('.all_settingsTOWFF_info') as HTMLElement;
        const SaveBt = document.getElementById('SaveFA') as HTMLElement;
        const switchONBtn = document.getElementById('SWitchbtn') as HTMLElement;


        allSittingsFaData.classList.add('hide');

        switchONBtn.addEventListener('click', () => {
            allSittingsFaData.classList.remove('hide');
            allSittingsData.classList.add('blur');
        });

        SaveBt.addEventListener('click', () => {
            allSittingsFaData.classList.add('hide');
            allSittingsData.classList.remove('blur');
        })
    }
    
    FaSittings();

    function TowFF() {
        const switchONBtn = document.getElementById('SWitchbtn') as HTMLElement;
        if (!switchONBtn) return;
    
        const OFF = '<img class="SwitchOFF" src="/public/logos/SwitchOFF.svg">';
        const ON = '<img class="SwitchON" src="/public/logos/SwitchON.svg">';
    
    
        switchONBtn.addEventListener('click', () => {
            if (switchONBtn.innerHTML === OFF)
            {
                switchONBtn.innerHTML = ON;
                switchONBtn.classList.add('SwitchedON');
                switchONBtn.classList.remove('SwitchedOFF');
            }
            else
            {
                switchONBtn.innerHTML = OFF;
                switchONBtn.classList.remove('SwitchedON');
                switchONBtn.classList.add('SwitchedOFF');
                
            }
        });
    }
    
    TowFF();
    
};
