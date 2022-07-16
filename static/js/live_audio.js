function get_audio_devices()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var json = JSON.parse(xmlHttp.responseText);
            console.log(json);
            var audio_devices_select = document.getElementById("audio_devices_select");

            for(var i in json)
            {
                var key = i;
                var name = json[i]["name"];
                var index = json[i]["index"];
                console.log(name);
                var option = document.createElement("option");
                option.text = name;
                option.value = index;
                audio_devices_select.appendChild(option);
            }

            change_audio_device(document.getElementById("audio_devices_select"));

        }
    }
    xmlHttp.open("GET", '/get_audio_devices', true); // true for asynchronous
    xmlHttp.send(null);
}

function change_audio_device(element)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var text = xmlHttp.responseText;
            console.log(text);

        }
    }
    var val = element.value;

    xmlHttp.open("GET", '/change_audio_device/'+val.toString(), true); // true for asynchronous
    xmlHttp.send(null);
}


function manage_record_button()
{
    var playButton = document.getElementById('record_control');
    var record = false;
    playButton.addEventListener('click', e => {
      e.preventDefault();
      record = !record;
      if(record == true)
      {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function()
            {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                {
                    var text = xmlHttp.responseText;
                    console.log(text);

                }
            }

            xmlHttp.open("GET", '/audio_device_start_recording', true); // true for asynchronous
            xmlHttp.send(null);
      }
      else
      {
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.onreadystatechange = function()
            {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
                {
                    var text = xmlHttp.responseText;
                    console.log(text);
                    get_combined_audio_file();

                }
            }

            xmlHttp.open("GET", '/audio_device_stop_recording', true); // true for asynchronous
            xmlHttp.send(null);
      }
      playButton.classList.toggle('is--playing');
    });
}

function get_combined_audio_file()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var text = xmlHttp.responseText;
            console.log(text);
            var output_audio = document.getElementById("output_audio");
            var output_audio_button = document.getElementById("audio_download_button");
            output_audio.src = text;
            audio_download_button.href = text;
            var audio_not_saved = document.getElementById("audio_not_saved");
            audio_not_saved.style.display = 'none';
        }
    }

    xmlHttp.open("GET", '/get_combined_audio_file', true); // true for asynchronous
    xmlHttp.send(null);
}

function manage_live_spectrum()
{
    var channel = document.getElementById("audio_spectrum");

    var freq_min = document.getElementById('freq_min');
    var freq_max = document.getElementById('freq_max');
    var time_min = document.getElementById('time_min');
    var time_max = document.getElementById('time_max');

    var spectrum_window = document.getElementById("spectrum_window");
    var window_height = spectrum_window.clientHeight;

    var channel_height = channel.clientHeight;
    var channel_width = channel.clientWidth;

    channel.style.bottom = window_height + 'px';

    var socket = io();

     socket.addEventListener('message', function (event)
     {
        console.log('Message from server ', event.data);
    });

    socket.on('connect', function()
    {
        socket.emit('get_images');
    });

    socket.on('image_upload', function(data)
    {
        console.log(data);
        var image = document.createElement('img');
         var channel_height = channel.clientHeight;
    var channel_width = channel.clientWidth;
        var segment_duration = data['length'];
        var segment_height = data['height'];
        var time_max_var = '-' + (window_height  * segment_duration / segment_height).toFixed(1).toString() + 's';
        time_max.innerHTML = time_max_var;
        image.style.display = 'block';
        image.src = data['src'];
        image.style.width = channel_width + 'px';
        channel.insertBefore(image, channel.firstChild);
        spectrum_bottom = parseInt(channel.style.bottom, 10);
        console.log(window_height)
        console.log(channel_height)
        channel.style.bottom = -channel_height + window_height + 'px';

    });

}

function manage_audio_info()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function()
    {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            var text = JSON.parse(xmlHttp.responseText);
            console.log(text);
            var info_table_record_length = document.getElementById("info_table_record_length");
            var info_table_packets_buffered = document.getElementById("info_table_packets_buffered");
            var info_table_start_tone = document.getElementById("info_table_start_tone");
            var info_table_phasing_signal = document.getElementById("info_table_phasing_signal");
            var info_table_image = document.getElementById("info_table_image");
            var info_table_stop_tone = document.getElementById("info_table_stop_tone");
            var info_table_black = document.getElementById("info_table_black");

            info_table_record_length.innerHTML = text["audio_length"].toString() + 's';
            info_table_packets_buffered.innerHTML = text["data_packets"].toString();
            if(text["start_tone_found"] == false)
            {
                info_table_start_tone.innerHTML = "<span style='color:red'>not found</span>";
            }else
            {
                info_table_start_tone.innerHTML = "<span style='color:green'>found</span>";
            }

            if(text["phasing_signal_found"] == false)
            {
                info_table_phasing_signal.innerHTML = "<span style='color:red'>not found</span>";
            }else
            {
                info_table_phasing_signal.innerHTML = "<span style='color:green'>found</span>";
            }

            if(text["image_process"] == "not started")
            {
                info_table_image.innerHTML = "<span style='color:red'>"+text["image_process"]+"</span>";
            }else
            {
                info_table_image.innerHTML = "<span style='color:white'>"+text["image_process"]+"</span>";
            }

            if(text["stop_tone_found"] == false)
            {
                info_table_stop_tone.innerHTML = "<span style='color:red'>not found</span>";
            }else
            {
                info_table_stop_tone.innerHTML = "<span style='color:green'>found</span>";
            }

            if(text["black_found"] == false)
            {
                info_table_black.innerHTML = "<span style='color:red'>not found</span>";
            }else
            {
                info_table_black.innerHTML = "<span style='color:green'>found</span>";
            }


        }
    }

    xmlHttp.open("GET", '/get_audio_info', true); // true for asynchronous
    xmlHttp.send(null);
}

function audio_info_interval(){
    manage_audio_info();

    setTimeout(audio_info_interval, 1000);
}

audio_info_interval();

manage_live_spectrum();
manage_record_button();
get_audio_devices();