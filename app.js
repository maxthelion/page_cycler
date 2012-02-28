var timeOut = null;

function fetchSettings(page){
  var rawData = localStorage[page + 'URLData']
  if (rawData)  
    return JSON.parse( rawData )
}

function saveSettings(page, data){
  localStorage[page + 'URLData'] = JSON.stringify(data)
}

function drawMain(data){
  $('#main').show();
  $('#config').hide();
  $('#current').attr('src', data[0].url)
  $('#waiting').attr('src', data[0].url)
  switchView(data)
}

function switchView(data){
  var first = data.shift()
  data.push(first)
  var second = data[0]
  if (second){
    $('#heading').text(first.heading || '')
    $('#waiting').css('height', '100%')
    $('#current').css('height', '1px')
    $('#waiting').attr('id', 'foo')
    $('#current').attr('id', 'waiting').attr('src', second.url)
    $('#foo').attr('id', 'current')
    timeOut = setTimeout(function(){
      switchView(data)
    }, first.duration || 10000)
  }
}

function saveData(){
  var data = [];
  $(this).find('.urlListItem').each(function(){
    var dataPoint = {}
    dataPoint.url = $(this).find('.urlField').val()
    dataPoint.heading = $(this).find('.headingField').val()
    dataPoint.duration = ($(this).find('.durationField').val() == "") ? 10000 : $(this).find('.durationField').val()
    if (dataPoint.url != ""){
      data.push(dataPoint)
    }
  })
  saveSettings(window.location.hash, data)
  drawMain(data)
  return false
}

function showConfig(){
  clearTimeout(timeOut)
  $('#main').hide();
  $('#config').show();
  $('#urlList').empty();
  var data = fetchSettings(window.location.hash) || [];
  for (var i=0; i < data.length; i++) {
    addListItem( data[i] )
  };
  addListItem()
  $('#config').submit(saveData)
}

function addListItem(item){
  if (item)
    $('#urlList').append('<div class="urlListItem"><input type="url" name="url" placeholder="URL" class="urlField" value="'+item.url+'"/>'+
                          '<input name="heading" class="headingField" placeholder="LABEL" value="'+item.heading+'"/>'+
                          '<input type="number" name="duration" class="durationField" placeholder="DURATION" value="'+(item.duration || 0)+'"/>'+
                          '</div>')
  else
    $('#urlList').append('<div class="urlListItem"><input type="url" name="url" placeholder="URL" class="urlField" />'+
                          '<input name="heading" class="headingField" placeholder="LABEL"/>'+
                          '<input type="number" name="duration" class="durationField" placeholder="DURATION"/>'+
                          '</div>')
}

$().ready(function(){
  var data = fetchSettings( window.location.hash )
  if (data) {
    drawMain(data)
  } else {
    showConfig()
  }
  $('#addBtn').click(function(){
    addListItem()
  })
  
  $('#editBtn').click(function(){
    showConfig()
  })
});