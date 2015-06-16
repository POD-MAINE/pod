/*
Copyright (C) 2014 Nicolas Can
Ce programme est un logiciel libre : vous pouvez
le redistribuer et/ou le modifier sous les termes
de la licence GNU Public Licence telle que publiée
par la Free Software Foundation, soit dans la
version 3 de la licence, ou (selon votre choix)
toute version ultérieure. 
Ce programme est distribué avec l'espoir
qu'il sera utile, mais SANS AUCUNE
GARANTIE : sans même les garanties
implicites de VALEUR MARCHANDE ou
D'APPLICABILITÉ À UN BUT PRÉCIS. Voir
la licence GNU General Public License
pour plus de détails.
Vous devriez avoir reçu une copie de la licence
GNU General Public Licence
avec ce programme. Si ce n'est pas le cas,
voir http://www.gnu.org/licenses/
*/
/** VARIABLES **/


/** DOC READY **/
$(document).ready(function() {
    /** NAVIGATION **/
    $("select.language").on('change',function(e) { $(this).parents("form").submit();});
    
    $('#filters input:checkbox').change(function() {
        get_ajax_url($('#filters').attr('action'), $('#filters').serialize());
    });

    $('div.list-all a').on('click',function(e) {
        if($(this).hasClass("list-all-plus")) {
            $(this).parent("div.list-all").children("a.list-all-minus").removeClass("hide");
            $(this).parents("fieldset:first").children("div.form-group").addClass("show-all");
            $(this).addClass("hide");
        } else {
            $(this).parent("div.list-all").children("a.list-all-plus").removeClass("hide");
            $(this).addClass("hide");
            $(this).parents("fieldset:first").children("div.form-group").removeClass("show-all");
        } 
        return false;
    });
    
    setPerPage();
    setOrderBy();
    /** FIN NAVIGATION **/
    
    /** SELECT USER **/
    $('#ownerbox').keyup(function(){
       var valThis = $(this).val().toLowerCase();
       if(valThis == "") $('.navList>div>label>input:not(:checked)').parent("label").parent("div").hide();
       else {
           $('.navList>div>label>input:not(:checked)').each(function(){ //:not(:checked)
             var text = $(this).parent("label").children("span.fullname").text().toLowerCase();
                (text.indexOf(valThis) != -1) ? $(this).parent("label").parent("div").show() : $(this).parent("label").parent("div").hide();
           });
       }
    });
    
    $('.navList>div>label>input:not(:checked)').parent("label").parent("div").hide();
    $(".navList>div>label>a.show-desc>span.user-description").hide();
    
    $('.navList>div>label>input').on('change',function(e) {
        if(!this.checked) {
             $(this).parent("label").parent("div").hide();
        } 
    }); 
    
    /** FORM VIDEO **/
    $('form').on('submit', function() { 
        preventUnloadPrompt = true;
        $('#process').find('div.anim').html(ajax_image);
        $('#process').show(); 
        $('form').hide(); 
        return true; 
    });
    
    $(window).bind("beforeunload", function(e) {
        if(typeof messageBeforeUnload != 'undefined' && messageBeforeUnload != "") {
            if(preventUnloadPrompt) {
                return;
            } else {
                return messageBeforeUnload;
            }
        }
    });
    
    var initial = new Array();
    $('#id_theme option:selected').each(function () {
            initial.push($(this).val());
    });

    $('#id_theme')
        .find('option')
        .remove()
        .end();
    //$('#id_theme').append(initial);
    $("#id_channel option:selected").each(function () {
        for (var i = 0; i < themetab[$(this).val()].length; i++) {
            if($.inArray(""+themetab[$(this).val()][i][0], initial) > -1)
            $('#id_theme').append('<option selected value="'+themetab[$(this).val()][i][0]+'">'+themetab[$(this).val()][i][1]+'</option>')
            else
            $('#id_theme').append('<option value="'+themetab[$(this).val()][i][0]+'">'+themetab[$(this).val()][i][1]+'</option>')
        }; 
    });

    $('#id_channel').change(function(){
        var str = "";
        $('#id_theme')
            .find('option')
            .remove()
            .end();
        $("#id_channel option:selected").each(function () {
            for (var i = 0; i < themetab[$(this).val()].length; i++) {
                $('#id_theme').append('<option value="'+themetab[$(this).val()][i][0]+'">'+themetab[$(this).val()][i][1]+'</option>')
            }; 
        });
    });
    /** FIN FORM VIDEO **/
    
    /** DJANGO FILER **/
    if (typeof num != 'undefined' && name == "") {
        showRelatedObjectLookupPopup = function(triggeringLink) {
            name = triggeringLink.id.replace(/^lookup_/, '');
            var href;
            if (triggeringLink.href.search(/\?/) >= 0) {
                href = triggeringLink.href + '&_popup=1';
            } else {
                href = triggeringLink.href + '?_popup=1';
            }
        	ifr = '<span id="framemessage"><p>Chargement en cours.Veuillez patienter...</p></span><iframe style="width:99%;height:1px;border:0;" id="resultFrame" src="'+href+'" onload="frameReady();" seamless="seamless"><p>Chargement en cours.Veuillez patienter...</p></iframe>';
        	$("#mediabox").html(ifr);
        	$('#myModal').modal({
              show: true,
              /*remote: href*/
            });
            return false;
        };
        
        dismissRelatedImageLookupPopup = function(win, chosenId, chosenThumbnailUrl, chosenDescriptionTxt) {
        	var img_name = name + '_thumbnail_img';
        	var txt_name = name + '_description_txt';
        	var clear_name = name + '_clear';
        	var elem = document.getElementById(name);
        	document.getElementById(name).value = chosenId;
        	document.getElementById(img_name).src = chosenThumbnailUrl;
        	document.getElementById(txt_name).innerHTML = chosenDescriptionTxt;
        	document.getElementById(clear_name).style.display = 'inline';
        	//close_box();
        	$('#myModal').modal('hide');
        };
    }
    /** DJANGO FILER **/
    
    
    
});

/** EVTS PERMANENT **/
/** video list **/
$(document).on('click', "#pagination .paginator a", function () {
    var newurl = $(this).attr('href');
    get_ajax_url(newurl);
    return false;
});
$(document).on('change', "#orderby", function () {
    createCookie("orderby", $(this).val(), null);
    get_ajax_url(window.location.href);
});
$(document).on('change', "#perpage", function () {
    createCookie("perpage", $(this).val(), null);
    get_ajax_url(window.location.href);
});
$(document).on('mouseenter', 'a.show-desc', function() {
    $( this ).children("span.user-description").show();
});
$(document).on('mouseleave', 'a.show-desc', function() {
    $( this ).children("span.user-description").hide();
});
/** end video list **/
/** video share embed **/
$(document).on('change', '#integration_size', function() {
    writeInFrame();
});
$(document).on('change', '#autoplay', function() {
    writeInFrame();
});
$(document).on('change', "#displaytime", function(e) {
    //$('#txtpartage').val(($('#displaytime:checked').val()) ? $('#txtpartage').val().replace(/(start=)\d+/, '$1'+parseInt(myPlayer.currentTime())) : $('#txtpartage').val().replace(/(start=)\d+/, '$10'));
    if($('#displaytime').is(':checked')){
        if($('#txtpartage').val().indexOf('start')>0){
             $('#txtpartage').val().replace(/(start=)\d+/, '$1'+parseInt(myPlayer.currentTime()));
        }else {
             $('#txtpartage').val($('#txtpartage').val()+'&start='+parseInt(myPlayer.currentTime()));
        }
        $('#txtposition').val(myPlayer.currentTime().toHHMMSS()); 
    }else{
         $('#txtpartage').val($('#txtpartage').val().replace(/(&start=)\d+/, ''));
         $('#txtposition').val("");
    }
});


$(document).on('click', "#share a", function() {
    var src = $(this).attr("href");
    if(src.indexOf("javascript")==-1) {
        window.open(src,'popup_1', config='height=400, width=600, toolbar=no, menubar=no, scrollbars=yes, resizable=yes' );
        return false;
    }
    return true;
});

/** end video share embed **/
$(document).on('click', 'button#button_video_favorite', function (event) {
    event.preventDefault();
    if($( "#video_favorite_form" ).length==0){
        alert($(this).children('span.sr-only').text());
    } else {
        if(expiration_date_second > 5) {
        var spanchild = $(this).children("span");
        var jqxhr = $.post( 
            $( "#video_favorite_form" ).attr('action'), 
            $( "#video_favorite_form" ).serialize(), 
            function(data) {
                var alert_text='<div class="alert alert-info" id="myAlert"><a href="#" class="close" data-dismiss="alert">&times;</a>'+data+'</div>';
                $('body').append(alert_text);
                $("#myAlert").on('closed.bs.alert', function () {
                    $(this).remove();
                });
                $("#myAlert").alert();
                if(spanchild.attr('id')=="fav") spanchild.attr('id', 'mark-as-fav');
                else spanchild.attr('id', 'fav');
                window.setTimeout(function() { $("#myAlert").alert('close'); }, 3000);
            });
        jqxhr.fail(function(data) {
            alert('Error '+data);
            //$('#player').after('<article class="messages"></article>');
            //$('article.messages').html("Error").delay(3000).fadeOut('slow', function(){$(this).remove();});
            //$(".alert").alert('close')
        });
        } else {
            alert(expiredsession);
            location.reload();
        }
    }
    return false;
});


$(document).on('click', 'button#button_video_alert', function (event) {
    console.log("Passage dans VIDEO ALERT");
    event.preventDefault();
    if($( "#video_favorite_form" ).length==0){
        alert($(this).children('span.sr-only').text());
    } else {
        if(expiration_date_second > 5) {
        var spanchild = $(this).children("span");
        var jqxhr = $.post( 
            $( "#video_favorite_form" ).attr('action'), 
            $( "#video_favorite_form" ).serialize(), 
            function(data) {
                var alert_text='<div class="alert alert-info" id="myAlert"><a href="#" class="close" data-dismiss="alert">&times;</a>'+data+'</div>';
                $('body').append(alert_text);
                $("#myAlert").on('closed.bs.alert', function () {
                    $(this).remove();
                });
                $("#myAlert").alert();
                if(spanchild.attr('id')=="fav") spanchild.attr('id', 'mark-as-fav');
                else spanchild.attr('id', 'fav');
                window.setTimeout(function() { $("#myAlert").alert('close'); }, 3000);
            });
        jqxhr.fail(function(data) {
            alert('Error '+data);
            //$('#player').after('<article class="messages"></article>');
            //$('article.messages').html("Error").delay(3000).fadeOut('slow', function(){$(this).remove();});
            //$(".alert").alert('close')
        });
        } else {
            alert(expiredsession);
            location.reload();
        }
    }
    return false;
});

/** END EVTS PERMANENT **/



/** FUNCTIONS **/
Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
        hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
};

// Edit the iframe and share link code
function writeInFrame() {
    // Iframe
    var str = $('#txtintegration').html();
    // Video size
    var $integration_size_option = $('#integration_size').find('OPTION:selected');
    var width = $integration_size_option.attr('data-width');
    var height = $integration_size_option.attr('data-height');
    var size = $integration_size_option.attr('value');
    str = str.replace(/(width=")\d+("\W+height=")\d+/, '$1' + width + '$2' + height);
    str = str.replace(/(size=)\d+/, '$1' + size);
    // Autoplay
    if ($('#autoplay').is(':checked')) {
        str = str.replace('is_iframe=true', 'is_iframe=true&autoplay=true');
    } else if (str.indexOf('autoplay=true') >= 0) {
        str = str.replace('&amp;autoplay=true', '');
    }
    $('#txtintegration').html(str);

    // Share link
    var link = $('#txtpartage').val();
    link = link.replace(/(size=)\d+/, '$1' + size);
    // Autoplay
    if ($('#autoplay').is(':checked')) {
        link = link.replace('is_iframe=true', 'is_iframe=true&autoplay=true');
    } else if (link.indexOf('autoplay=true') >=0) {
        link = link.replace('&autoplay=true', '');
    }
    $('#txtpartage').val(link);
}

function setPerPage() {
    $("#perpage").prop('selected', false);
    cperpage = getCookie("perpage");
    if(cperpage!=null) {
        $("#perpage").val(cperpage);
        $("#perpage option").each(function(){
            if ($(this).attr("value") == cperpage) {
                $(this).attr("selected",true);
            } else {
                $(this).removeAttr("selected");
            }
        });
    }
}

function setOrderBy() {
    $("#orderby").prop('selected', false);
    corderby = getCookie("orderby");
    if(corderby==null) corderby="order_by_-date_added"
    if(corderby!=null) {
        $("#orderby").val(corderby);
        $("#orderby option").each(function(){
            if ($(this).attr("value") == corderby) {
                $(this).attr("selected",true);
            } else {
                $(this).removeAttr("selected");
            }
        });
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
    
function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    } else var expires = "";
    document.cookie = escape(name)+"="+escape(value)+expires+"; path=/";
}



function get_ajax_url(newurl, attrs) {
    $("#objects_list").css("height",$("#objects_list").height());
    $(".mainToolbar").hide();
    var filter_is_visible = $('#filters').is(":visible")
    $('#filters').hide();
    $( "#objects_list" ).fadeOut("fast", function() {
        $( "#objects_list" ).html( ajax_image ).fadeIn("fast", function() {
            $.get( newurl, attrs, function( data ) {
                $( "#objects_list" ).fadeOut("fast", function() {
                    $( "#objects_list" ).html( data );
                    setOrderBy();
                    $("a.show-desc span").hide();
                    $( "#objects_list" ).fadeIn("fast");
                    $("#objects_list").css("height","auto");
                });
                
                if(attrs){
                    if (window.history && window.history.pushState) {
                       history.replaceState(null, null, location.protocol + '//' + location.host + location.pathname +"?"+ attrs);
                     }
                } else {
                    if (window.history && window.history.pushState) {
                        if(newurl.indexOf("?")==0)
                            history.replaceState(null, null, location.protocol + '//' + location.host + location.pathname + newurl);
                        else
                            history.replaceState(null, null, newurl);
                    }
                }
                setPerPage();
                $(".mainToolbar").show();
                if(filter_is_visible) $('#filters').show();
            }).fail(function() { alert( "error" ); });
        });
    });
}

function frameReady(){
    //alert('frameready');
    $("#framemessage").hide();
    $("#resultFrame").height("450px");
    var el = document.getElementById('resultFrame');
    getIframeWindow(el).opener = window;
}

function getIframeWindow(iframe_object) {
    var doc;

    if (iframe_object.contentWindow) {
    return iframe_object.contentWindow;
    }

    if (iframe_object.window) {
    return iframe_object.window;
    } 

    if (!doc && iframe_object.contentDocument) {
    doc = iframe_object.contentDocument;
    } 

    if (!doc && iframe_object.document) {
    doc = iframe_object.document;
    }

    if (doc && doc.defaultView) {
    return doc.defaultView;
    }

    if (doc && doc.parentWindow) {
    return doc.parentWindow;
    }

    return undefined;
}

function linkTo_UnCryptMailto( s )
{
    location.href="mailto:"+window.atob(s);
}
