   function openMenu() {
            document.getElementById("myNav").style.width = "100%";
        }

        function closeMenu() {
            document.getElementById("myNav").style.width = "0%";
        }

        function toggleMenu() {
            const menu = document.getElementById("myNav");
            if (menu.style.width === "100%") {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Add click functionality to brand name and menu trigger
        document.addEventListener("DOMContentLoaded", function() {
            const brandName = document.querySelector(".brand-name");
            const menuTrigger = document.querySelector(".menu-trigger");
            
            if (brandName) {
                brandName.addEventListener("click", closeMenu);
            }
            
            if (menuTrigger) {
                menuTrigger.addEventListener("click", openMenu);
            }
        });

        /* Dashboard live updates */
        (function(){
            const moistureEl = () => document.getElementById('moisture');
            const tempEl = () => document.getElementById('temperature');
            const healthEl = () => document.getElementById('health');
            const pestEl = () => document.getElementById('pestStatus');
            const imgEl = () => document.getElementById('fieldsImg');

            function clamp(v, a, b){ return Math.max(a, Math.min(b, v)); }

            function updateDashboard(){
                // simple simulated values
                const mRaw = Math.round(30 + (Math.random()*14 - 2));
                const moisture = clamp(mRaw, 5, 100);
                const tempRaw = Math.round(18 + (Math.random()*12 - 1));
                const temperature = clamp(tempRaw, -10, 50);

                if (moistureEl()) moistureEl().innerText = moisture + '%';
                if (tempEl()) tempEl().innerText = temperature + '°C';

                // derive health
                let health = 'Good';
                if (moisture < 18) health = 'Poor';
                else if (moisture < 28) health = 'Fair';
                if (healthEl()) healthEl().innerText = health;

                // pest risk based on randomness + moisture
                const r = Math.random();
                let pest = 'Low Risk';
                if (r > 0.88 || moisture < 12) pest = 'High Risk';
                else if (r > 0.6) pest = 'Moderate';
                if (pestEl()) pestEl().innerText = pest;
            }

            // image fallback: use an inline SVG if the file fails to load
            function setImageFallback(){
                const img = imgEl();
                if (!img) return;
                img.addEventListener('error', function(){
                    const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><rect width='100%' height='100%' fill='#dfe6d5'/><text x='50%' y='50%' font-size='18' text-anchor='middle' fill='#6b6b6b' dy='.35em'>Fields image not available</text></svg>`);
                    img.src = 'data:image/svg+xml;charset=utf-8,' + svg;
                });
                // reassign to trigger potential error handler in some browsers
                const src = img.getAttribute('src');
                img.setAttribute('src', src);
            }

            document.addEventListener('DOMContentLoaded', function(){
                updateDashboard();
                setImageFallback();
                setInterval(updateDashboard, 5000);
            });
        })();

// mark active top-nav link
document.addEventListener('DOMContentLoaded', function(){
    try {
        const parts = location.pathname.split('/');
        const current = parts.pop() || 'index.html';
        document.querySelectorAll('.top-nav a').forEach(a=>{
            const href = a.getAttribute('href');
            if (!href) return;
            // normalize
            if (href === current || (href === 'index.html' && current === '')) {
                a.classList.add('active');
            }
            // also handle when href is full path
            if (location.pathname.endsWith(href)) a.classList.add('active');
        });
    } catch(e){ /* ignore in older browsers */ }
});

// Auto-update footer year ✅
document.addEventListener('DOMContentLoaded', function(){
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
});

// Footer enhancements: back-to-top and simple newsletter handling
(function(){
    const backBtn = document.getElementById('back-to-top');
    function toggleBack() {
        if (!backBtn) return;
        if (window.scrollY > 300) backBtn.classList.add('visible');
        else backBtn.classList.remove('visible');
    }
    window.addEventListener('scroll', toggleBack);
    document.addEventListener('click', function(e){ if (e.target && e.target.id === 'back-to-top') window.scrollTo({top:0,behavior:'smooth'}); });

    // Newsletter form
    const form = document.getElementById('newsletter-form');
    const msg = document.getElementById('newsletter-msg');
    if (form) {
        form.addEventListener('submit', function(ev){
            ev.preventDefault();
            const email = (document.getElementById('newsletter-email') || {}).value || '';
            const optin = (document.getElementById('newsletter-optin') || {}).checked || false;
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!re.test(email)) {
                if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('error'); }
                return;
            }
            try {
                localStorage.setItem('farm_newsletter', JSON.stringify({email, optin, ts: Date.now()}));
                if (msg) { msg.textContent = 'Thank you — subscription saved locally.'; msg.classList.remove('error'); msg.classList.add('success'); }
                form.reset();
            } catch(e) { if (msg) msg.textContent = 'Unable to save subscription.'; }
        });
    }
})();