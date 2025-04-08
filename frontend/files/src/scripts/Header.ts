export function HeaderData()
{
	const header = document.getElementById('header') as HTMLHeadElement;

	const  HeaderHTML =
			`<header class="header_notif max-635:px-14 px-24 lg:px-32 z-10">
				<button data-page="profil" title="Home" class="home-btn logo_notif transition-transform duration-300 hover:scale-110">
					<img class="logo-pic_notif" src="../public/logos/pingpong_racket.png">
					<div class="logo-name_notif">
						<p class="logo-name1_notif">
							PingPong.io
						</p>
						<p class="hero_notif">
							Table Heroes
						</p>
					</div>
				</button data-page="home" title="Home">
				<div class="center_notif">
				</div>
				<div class="sign-bt_notif">
					<button id="logOutBtn" class="log-in-bt1_notif" inert>
						<img class="user_header_pic" src="../public/profile_pictures/ProfilePic.jpeg">
						<span id="iPlayerUsername" class="user_name_header"></span>
						<!-- <img class="user_notification_header" src="../public/logos/bell.svg"> -->
					</button>
				</div>
			</header>`;

			if(header)
			{
				header.innerHTML = HeaderHTML;
			}
}