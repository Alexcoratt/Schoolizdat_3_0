let key = 'B6NoZk2Y-JLJDVxee-b_vJGAe1-0PkiRPUYwNKSzsO9-zoE8eiqr-kHwLVRH9-TebGEWloL7FWyr&AE;DQTn<MMkq;LIxdTXB!cH{Lrf.<#ZdyOXlmef-j7HquVdW-diY6n8So-D95uejn6wMvAKKz2-uP_TBor7-biDTKEgx-OeAhEGGm'
// $(document).ready(function() {
// 	$('#pagepiling').pagepiling({
        
//         navigation: {
//             // 'textColor': '#000',
//             // 'bulletsColor': '#000',
//             'position': 'left',
//             // 'tooltips': ['section1', 'section2', 'section3', 'section4']
//         },
//     });
// });
new fullpage('#fullpage', {
	//options here
    
	menu: '#pagination',
    
	anchors: ['main-slide1', 'season-theme1', 'news1', 'nominations1', 'reviews1'],
    
	lockAnchors: false,
    licenseKey: key,
	autoScrolling:true,
    scrollOverflow: true,
    normalScrollElements: '.fb-paragraph'
});
console.log('pagepiling init')