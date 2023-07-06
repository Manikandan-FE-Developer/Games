// 	  Onclick to display the navbar 	//
document.querySelector('.menu').addEventListener('click',function(){
	document.querySelector('.navlist').classList.toggle('active');
});

//	Change the menu icon to close icon 	//
changeIcon = (icon) => icon.classList.toggle('fa-times')
