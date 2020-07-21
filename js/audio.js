$(function () {
    let audio_length = $('.article-audio').length;
    for (let j = 0; j < audio_length; j++) {
        const obj = $($('.article-audio')[j]);
        if (obj.hasClass('rendered')) {
            continue
        }

        obj.append(`<div class="track-progress"></div>`)

        obj.prepend(`<div class="all-control">
                        <div class="btn">
                            <div class="play">
                                <svg class="svg-play" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z"/></svg>
                                <svg class="svg-stop" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M8 6h8c1.1 0 2 .9 2 2v8c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z"/></svg>
                            </div>
                        </div>
                        <div class="time">
                            <span class="min">00</span>:<span class="sec">00</span>
                        </div>
                    </div>`);

        obj.find('.track').each(function () {
            let track = this;
            let name = $(track).attr('data-name');
            let src = $(track).attr('data-src');
            $(track).html(`<audio src="${src}"></audio>
                        <div class="btn-group">
                            <div class="solo btn" title="Solo">S</div>
                            <div class="mute btn" title="Mute">M</div>
                        </div>
                        <div class="name">
                            ${name}
                        </div>
                        <div class="icon">
                            <svg class="playing" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z"/></svg>
                            <svg class="_muted" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M3.63 3.63c-.39.39-.39 1.02 0 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v1.79l2.48 2.48c.01-.08.02-.16.02-.24z"/></svg>
                        </div>`);
        })

        // events
        let audio = []
        for (let i = 0; i < obj.find('.track').length; i++) {
            const audio_element = $(obj.find('.track')[i]).find('audio');
            audio.push(audio_element);

            let muted = $(obj.find('.track')[i]).attr('muted');
            if (typeof muted !== typeof undefined && muted !== false) {
                obj.find('.track').addClass('soloing')
                $(obj.find('.track')[i]).addClass('muted').removeClass('soloing')
                $(obj.find('.track')[i]).find('audio')[0].volume = 0
            }
        }

        if(audio.length <= 1){
            $('.track .btn-group', obj).hide();
        }

        audio[0][0].onloadedmetadata = function () {
            let dur = audio[0][0].duration;
            let time_wrap = obj.find('.all-control .time')
            let min = parseInt(Math.floor(dur / 60))
            if (min < 10) min = '0' + min
            let sec = parseInt(dur % 60)
            if (sec < 10) sec = '0' + sec
            time_wrap.find('.min').text(min)
            time_wrap.find('.sec').text(sec)
        }

        audio[0][0].onplay = function () {
            setTimeout(() => {
                if (audio.length > 1) {
                    for (let i = 0; i < audio.length; i++) {
                        const audio_elements = audio[i][0];
                        if (i == 0) {
                            continue
                        }
                        audio_elements.currentTime = audio[0][0].currentTime
                    }
                }
            }, 3000);
        }

        audio[0][0].ontimeupdate = function () {
            let proc = obj.find('.track-progress')
            let audio_ele = audio[0][0]
            let percent = audio_ele.currentTime / audio_ele.duration
            proc.css({
                width: percent * 100 + '%'
            })
        }

        audio[0][0].onended = function () {
            $('.all-control .btn', obj).removeClass('playing')
            let proc = obj.find('.track-progress')
            proc.css({
                width: 0 + '%'
            })
            for (let i = 0; i < audio.length; i++) {
                const audio_elements = audio[i][0];
                audio_elements.pause()
                audio_elements.currentTime = 0
            }
        }

        $('.all-control .btn', obj).click(function () {
            $('.article-audio audio').each(function(i){
                if(i == j){
                    return false
                }
                this.pause()
                this.currentTime = 0
                let parent = $(this).parents('.article-audio')
                parent.find('.all-control .btn').removeClass('playing')
                parent.find('.track-progress').css({
                    width: 0
                })
            });
            var _this = $(this)
            if (_this.hasClass('playing')) {
                _this.removeClass('playing')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    audio_elements.pause()
                    audio_elements.currentTime = 0
                }
            } else {
                _this.addClass('playing')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    audio_elements.play()
                }
            }
        });

        $('.btn-group .solo', obj).click(function () {
            let track = $(this).parents('.track')
            let index = track.index() - 1

            if (track.hasClass('soloing')) {
                $('.track', obj).removeClass('soloing muted')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    audio_elements.volume = 1
                }
            } else {
                $('.track', obj).addClass('muted').removeClass('soloing')
                track.addClass('soloing').removeClass('muted')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    if (i == index) {
                        audio_elements.volume = 1
                    } else {
                        audio_elements.volume = 0
                    }
                }
            }
        });

        $('.btn-group .mute', obj).click(function () {
            let track = $(this).parents('.track')
            let index = track.index() - 1

            if (track.hasClass('muted')) {
                $('.track', obj).removeClass('soloing muted')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    audio_elements.volume = 1
                }
            } else {
                $('.track', obj).addClass('soloing').removeClass('muted')
                track.addClass('muted').removeClass('soloing')
                for (let i = 0; i < audio.length; i++) {
                    const audio_elements = audio[i][0];
                    if (i == index) {
                        audio_elements.volume = 0
                    } else {
                        audio_elements.volume = 1
                    }
                }
            }
        })
    }
})