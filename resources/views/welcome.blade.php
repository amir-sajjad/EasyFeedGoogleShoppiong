<!doctype html>
<html lang="en">

{{-- <head>
    <script src="https://livechat.wixpa.com/supportboard/js/min/jquery.min.js"></script>
    <script id="sbinit" src="https://livechat.wixpa.com/supportboard/js/main.js"></script>
</head> --}}

<body>
    @extends('shopify-app::layouts.default')
    @section('styles')
        {{ vite_assets() }}
    @endsection
    @section('content')
        <div id="root"></div>
        <div id="billing_status" data="{{ config('shopify-app.billing_enabled') }}"></div>
        <div id="productCategories" data="{{ $googleProductCategories }}"></div>
        <div id="shopName" data="{{ $shopDomain ?? Auth::user()->name }}"></div>
        {{-- @viteReactRefresh
        @vite('resources/js/app.js') --}}
    @endsection
    @section('scripts')
        @parent

        <script>
            const storeEmail="{{Auth::user()->settings->store_email??null }}";
        </script>

        <!-- Google tag (gtag.js) -->
        {{-- <script async src="https://www.googletagmanager.com/gtag/js?id=G-TMF9MDLSFD"></script>
        <script>
            window.dataLayer = window.dataLayer || [];

            function gtag() {
                dataLayer.push(arguments);
            }
            gtag('js', new Date());

            gtag('config', 'G-TMF9MDLSFD');
        </script> --}}
        <!-- Google tag (gtag.js) -->

        <!-- Meta Pixel Code -->
        <script>
            ! function(f, b, e, v, n, t, s) {
                if (f.fbq) return;
                n = f.fbq = function() {
                    n.callMethod ?
                        n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                };
                if (!f._fbq) f._fbq = n;
                n.push = n;
                n.loaded = !0;
                n.version = '2.0';
                n.queue = [];
                t = b.createElement(e);
                t.async = !0;
                t.src = v;
                s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s)
            }(window, document, 'script',
                'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '665412425278945');
            fbq('track', 'PageView');
        </script>
        <noscript><img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=665412425278945&ev=PageView&noscript=1" /></noscript>
        <!-- End Meta Pixel Code -->

        {{-- <script src="https://livechat.wixpa.com/supportboard/js/min/jquery.min.js"></script>
        <script id="sbinit" src="https://livechat.wixpa.com/supportboard/js/main.js"></script> --}}
        {{-- <script id="chat-init" src="https://cloud.board.support/account/js/init.js?id=329026172"></script> --}}
        <script type="text/javascript">
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = "8305e843-f408-4c73-8b4d-c65666845987";
            (function() {
                d = document;
                s = d.createElement("script");
                s.src = "https://client.crisp.chat/l.js";
                s.async = 1;
                d.getElementsByTagName("head")[0].appendChild(s);
            })();
        </script>
    @endsection
</body>


</html>
