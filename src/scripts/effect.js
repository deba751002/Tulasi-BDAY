// Set this to enable a countdown screen before the party unlocks, e.g. '2026-09-20T00:00:00'.
// Leave it null to skip the countdown and always show the full experience.
var BIRTHDAY_DATE = null;

function safePlay(audioEl) {
	var p = audioEl.play();
	if (p && p.catch) { p.catch(function () {}); }
}

// Short synthesized "chime" on every button click — no audio file needed, so it
// can never fail to load. Falls back to silence in browsers without Web Audio.
function playChime() {
	try {
		var Ctx = window.AudioContext || window.webkitAudioContext;
		var ctx = playChime._ctx || (playChime._ctx = new Ctx());
		var o = ctx.createOscillator();
		var g = ctx.createGain();
		o.type = 'sine';
		o.frequency.setValueAtTime(880, ctx.currentTime);
		o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12);
		g.gain.setValueAtTime(0.15, ctx.currentTime);
		g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
		o.connect(g);
		g.connect(ctx.destination);
		o.start();
		o.stop(ctx.currentTime + 0.3);
	} catch (e) {}
}

// A quick burst of falling confetti pieces, used when the birthday card opens.
function burstConfetti() {
	var colors = ['#C99383', '#5C2A45', '#F3D4D0', '#FBF3EA', '#8B5A6F'];
	for (var i = 0; i < 40; i++) {
		var piece = document.createElement('div');
		piece.className = 'confetti-piece';
		piece.style.left = Math.random() * 100 + 'vw';
		piece.style.background = colors[i % colors.length];
		piece.style.animationDuration = (2 + Math.random() * 1.5) + 's';
		piece.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
		document.body.appendChild(piece);
		(function (el) {
			setTimeout(function () { el.remove(); }, 4000);
		})(piece);
	}
}

// Fades .scroll-reveal elements in as they enter the viewport (memory cards, wishes).
var revealObserver = ('IntersectionObserver' in window) ? new IntersectionObserver(function (entries) {
	entries.forEach(function (entry) {
		if (entry.isIntersecting) {
			entry.target.classList.add('in-view');
			revealObserver.unobserve(entry.target);
		}
	});
}, { threshold: 0.15 }) : null;

function observeReveal(selector) {
	if (!revealObserver) {
		$(selector).addClass('in-view');
		return;
	}
	document.querySelectorAll(selector).forEach(function (el) {
		if (!el.classList.contains('in-view')) { revealObserver.observe(el); }
	});
}

$(document).ready(function () {
	if (BIRTHDAY_DATE && new Date() < new Date(BIRTHDAY_DATE)) {
		$('.loading').hide();
		$('#countdown_screen').css('display', 'flex');

		var timer = setInterval(function () {
			var diff = new Date(BIRTHDAY_DATE) - new Date();
			if (diff <= 0) {
				clearInterval(timer);
				$('#countdown_screen').fadeOut('slow', function () {
					$('.container').fadeIn('fast');
				});
				return;
			}
			var d = Math.floor(diff / (1000 * 60 * 60 * 24));
			var h = Math.floor((diff / (1000 * 60 * 60)) % 24);
			var m = Math.floor((diff / (1000 * 60)) % 60);
			var s = Math.floor((diff / 1000) % 60);
			$('#cd_days').text(String(d).padStart(2, '0'));
			$('#cd_hours').text(String(h).padStart(2, '0'));
			$('#cd_minutes').text(String(m).padStart(2, '0'));
			$('#cd_seconds').text(String(s).padStart(2, '0'));
		}, 1000);
	} else {
		$('.loading').fadeOut('fast');
		$('.container').fadeIn('fast');
	}
});

$(document).ready(function () {
	$(document).on('click', '.btn-primary', playChime);

	observeReveal('.memory-card');

	$('#initial').click(function () {
		safePlay($('.song')[0]);
		$(this).fadeOut('slow').delay(50).promise().done(function () {
			$('#turn_on').fadeIn('slow');
		});
	});

	$('#play').click(function () {
		safePlay($('.song')[0]);
		$('#bulb_yellow').addClass('bulb-glow-yellow-after');
		$('#bulb_red').addClass('bulb-glow-red-after');
		$('#bulb_blue').addClass('bulb-glow-blue-after');
		$('#bulb_green').addClass('bulb-glow-green-after');
		$('#bulb_pink').addClass('bulb-glow-pink-after');
		$('#bulb_orange').addClass('bulb-glow-orange-after');
		$('body').css('background-color', '#FFF');
		$('body').addClass('peach-after');
		$(this).fadeOut('slow').delay(5000).promise().done(function () {
			$('#bannar_coming').fadeIn('slow');
		});
	});

	$('#turn_on').click(function () {
		safePlay($('.song')[0]);
		$('.about-tulasi').fadeOut('slow');
		$('#bulb_yellow').addClass('bulb-glow-yellow');
		$('#bulb_red').addClass('bulb-glow-red');
		$('#bulb_blue').addClass('bulb-glow-blue');
		$('#bulb_green').addClass('bulb-glow-green');
		$('#bulb_pink').addClass('bulb-glow-pink');
		$('#bulb_orange').addClass('bulb-glow-orange');
		$('body').addClass('peach');
		$('#welcome_dance').remove();
		$(this).fadeOut('slow').delay(5000).promise().done(function () {
			$('#play').fadeIn('slow');
		});
	});

	$('#bannar_coming').click(function () {
		$('#banner').css('display', 'block');
		$('.bannar').addClass('center');
		$('.bannar').addClass('bannar-come');
		$(this).fadeOut('slow').delay(5000).promise().done(function () {
			$('#balloons_flying').fadeIn('slow');
		});
	});

	// Balloons rise via a single CSS animation (see modern-theme.css) instead of nine
	// separate jQuery position-tween loops — lighter on the CPU and far less code.
	$('#balloons_flying').click(function () {
		$('.balloon-border').animate({ top: -500 }, 8000);
		$('.balloons').addClass('balloon-float');

		$(this).fadeOut('slow').delay(5000).promise().done(function () {
			$('#invite_friends').fadeIn('slow');
		});
	});

	$('#invite_friends').click(function () {
		var vw = $(window).width() / 2;
		var mid = $(window).height() / 2;
		var mid_diff = mid / 12;
		var vw_diff = vw / 12;

		$('#self').css({ display: 'block', bottom: '0px', left: vw + 'px' });
		$('#self').animate({ top: mid - mid_diff * 4, left: vw }, 3000);

		$('#f1').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f1').animate({ top: mid - mid_diff * 3, left: vw - vw_diff * 3 }, 3000);

		$('#f2').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f2').animate({ top: mid - mid_diff * 3, left: vw + vw_diff * 3 }, 3000);

		$('#f3').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f3').animate({ top: mid - mid_diff * 2, left: vw - vw_diff * 4 }, 3000);

		$('#f4').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f4').animate({ top: mid - mid_diff * 2, left: vw + vw_diff * 4 }, 3000);

		$('#f5').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f5').animate({ top: mid - mid_diff, left: vw + vw_diff * 5 }, 3000);

		$('#f6').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f6').animate({ top: mid - mid_diff, left: vw - vw_diff * 5 }, 3000);

		$('#f7').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f7').animate({ top: mid, left: vw - vw_diff * 6 }, 3000);

		$('#f8').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f8').animate({ top: mid, left: vw + vw_diff * 6 }, 3000);

		$('#f9').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f9').animate({ top: mid + mid_diff * 3, left: vw + vw_diff * 2 }, 3000);

		$('#f10').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f10').animate({ top: mid + mid_diff, left: vw - vw_diff * 7 }, 3000);

		$('#f11').css({ display: 'block', top: 500 * Math.random() + 'px', right: '0px' });
		$('#f11').animate({ top: mid + mid_diff, left: vw + vw_diff * 7 }, 3000);

		$('#f12').css({ display: 'block', top: 500 * Math.random() + 'px', left: '0px' });
		$('#f12').animate({ top: mid + mid_diff * 3, left: vw - vw_diff * 4 }, 3000);

		$(this).fadeOut('slow').delay(5000).promise().done(function () {
			$('#cake_fadein').fadeIn('slow');
		});
	});

	$('#cake_fadein').click(function () {
		$('#cake_pink').css('display', 'block');
		$('#candle').css('display', 'block');
		$('#cake_pink').fadeIn('slow');
		$(this).fadeOut('slow').delay(3000).promise().done(function () {
			$('#dj_time').fadeIn('slow');
		});
	});

	$('#dj_time').click(function () {
		$('.song')[0].pause();
		safePlay($('.song1')[0]);
		$('body').addClass('peach-disco');
		$('#f1').addClass('dance-one');
		$('#f3').addClass('dance-two');
		$('#f2').addClass('dance-one');
		$('#f4').addClass('dance-two');
		$('#f5').addClass('dance-one');
		$('#f6').addClass('dance-one');
		$('#f7').addClass('dance-two');
		$('#f8').addClass('dance-two');
		$('#f11').addClass('dance-two');
		$('#f12').addClass('dance-two');
		$('#self').addClass('dance-one');
		$('#f9').addClass('dance-one');
		$('#f10').addClass('dance-one');

		$('#bulb_yellow').addClass('bulb-glow-yellow-disco');
		$('#bulb_red').addClass('bulb-glow-red-disco');
		$('#bulb_blue').addClass('bulb-glow-blue-disco');
		$('#bulb_green').addClass('bulb-glow-green-disco');
		$('#bulb_pink').addClass('bulb-glow-pink-disco');
		$('#bulb_orange').addClass('bulb-glow-orange-disco');

		var vw = $(window).width() / 2;
		$('#b1,#b2,#b3,#b4,#b5,#b6,#b7').removeClass('balloon-float');
		$('#b1').attr('id', 'b11');
		$('#b2').attr('id', 'b22');
		$('#b3').attr('id', 'b33');
		$('#b4').attr('id', 'b44');
		$('#b5').attr('id', 'b55');
		$('#b6').attr('id', 'b66');
		$('#b7').attr('id', 'b77');
		$('#b11').animate({ top: 240, left: 0 }, 500);
		$('#b22').animate({ top: 240, left: vw - (vw * 2) / 3 }, 500);
		$('#b33').animate({ top: 240, left: vw - vw / 3 }, 500);
		$('#b44').animate({ top: 240, left: vw }, 500);
		$('#b55').animate({ top: 240, left: vw + vw / 3 }, 500);
		$('#b66').animate({ top: 240, left: vw + (vw * 2) / 3 }, 500);
		$('#b77').animate({ top: 240, left: 2 * vw }, 500);
		$('.balloons').css('opacity', '0.9');
		$('.balloons h2').fadeIn(3000);

		$(this).fadeOut('slow').delay(3000).promise().done(function () {
			$('#our_memories').fadeIn('slow');
		});
	});

	$('#our_memories').click(function () {
		burstConfetti();
		$('#memories_section').fadeIn('slow');
		$(this).fadeOut('slow');
	});

	$('#play_again').click(function () {
		window.location.href = 'index.html';
	});
});
