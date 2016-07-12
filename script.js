
// Globals
var contactObjArr = [];
var sortOrder = 'asc';
var sortBy = 'firstName';
var moAtoZList = []

  var sampleContacts = [
    {firstName: 'Anne', lastName: 'Johnson', phone: '4162322323'},
    {firstName: 'Bella', lastName: 'Smith', phone: '4166312122'},
    {firstName: 'Cindy', lastName: 'Crawford', phone: '4169786756'},
    {firstName: 'Dory', lastName: 'Remo', phone: '4162343434'},
    {firstName: 'Ella', lastName: 'Abraham', phone: '4166765656'},
    {firstName: 'Fiona', lastName: 'Allison', phone: '4163432344'}
  ];

  $('#sampleContacts').click(function(){
    if(contactObjArr.length !== 0) {
      contactObjArr = [];
      $('#displayInfo-container').hide();
    } else {
      contactObjArr = JSON.parse(JSON.stringify(sampleContacts));
    }

    sortContacts();
    refreshSelectBox();
    refreshSelectContactDisplay();
  });

  $('#addBtn').click(function() {

    if(validateAdd()) {
      contactObjArr.push({firstName: $('#firstName').val(), lastName: $('#lastName').val(), phone:$('#phone').val()});
      sortContacts();
      refreshSelectBox();
    }

    return false;
  });

  $('#btnAdd').click(function(){
    $('#displayInfo-container').hide();
    $('#addControls-container').show();
    return false;
  });

  $('#cancelAdd').click(function(){
    clearAddControls();
    $('#addControls-container').hide();
    return false;
  });

  function clearAddControls() {
    $('#firstName').val('');
    $('#lastName').val('');
    $('#phone').val('');
    $('.error').hide();
  }

  function validateAdd() {
    var firstName = $('#firstName').val();
    var lastName = $('#lastName').val();
    var phone = $('#phone').val();
    var valid = true;

    if(!firstName) {
      $('#firstNameError').html('Enter first name!').show();
      valid = false;
    } else {
      $('#firstNameError').hide();
    }

    if(!lastName) {
      $('#lastNameError').html('Enter last name!').show();
      valid = false;
    } else {
      $('#lastNameError').hide();
    }

    var phoneRegExp = /^[0-9]{10,}$/g;

    if(!phone) {
      $('#phoneError').html('Enter phone number!').show();
      valid = false;
    } else if (phone && !phone.match(phoneRegExp)) {
      $('#phoneError').html('Phone should be 10 digits or more numbers only!').show();
      valid = false;
    } else if (phone && findPhoneIndex(phone) > -1) {
      $('#phoneError').html('Phone number already exist!').show();
      valid = false;
    } else {
      $('#phoneError').hide();
    }

    return valid;
  }

  function findPhoneIndex(phone) {
    return contactObjArr.map(function(obj) { return obj.phone; }).indexOf(phone);
  }

  function findFirstOccurance(letter) {
    return contactObjArr.map(function(obj) { return obj[sortBy].substr(0,1).toUpperCase(); }).indexOf(letter.toUpperCase());
  }


  $('#btnDelete').click(function() {
    var selectedItems = $("#selectBox").val();
    var selItemLen = selectedItems ? selectedItems.length : 0;
    if(selItemLen > 0){
      for (var i = 0, iLen = selItemLen; i < iLen; i++) {
        removeFromContactsArr(selectedItems[i]);
      }
      $('#displayInfo-container').hide();
    } else {
      alert('Select contact to delete!');
    }
    return false;
  });

  function removeFromContactsArr(phone) {
    //removeFromSelectBox(phone);
    contactObjArr.splice(findPhoneIndex(phone), 1);
    refreshSelectBox();
    refreshSelectContactDisplay();
  }

  function removeFromSelectBox(val) {
    var selOption ="option[value='"+val+"']";
    $('#selectBox').find(selOption).remove();
  }

  $('.btnSortBy').click( function() {
    sortBy = $(this).attr('data-sortBy');
    $('.btnSortBy').css('background-color', '#1E90FF');
    $(this).css('background-color', '#708090');
    toggleSortOrder();
    sortContacts();
    refreshSelectBox();
    return false;
  });

  $('#selectBox').change(function(){
    refreshSelectContactDisplay();
    $('#displayInfo-container').show();
    return false;
  });

  function refreshSelectContactDisplay() {
    $('#selectedContactList').empty();
    var selectValues = $('#selectBox').val();
    for (var i = 0, iLen = selectValues.length; i < iLen ; i++) {
      var obj = contactObjArr.find(function(obj){return obj.phone === selectValues[i]});
      var fullName = obj.firstName + ' ' + obj.lastName;
      var phone = selectValues[i];
      addToDisplayContact({fullName: fullName, phone: phone});
    }
  }

  function addToDisplayContact(obj) {
    var phone = formatPhone(obj.phone.toString());
    var htmlContent = `<div id="display-contacts" class="display-contacts">
      <div class="display-field">
        <label class="fieldTitle">Full Name: </label>
        <label class="fieldValue">${obj.fullName}</label>
      </div>
      <div class="display-field">
        <label class="fieldTitle">Phone Number:</label>
        <label class="fieldValue"><a href='tel:${obj.phone}'>${phone}</a></label>
      </div>
    </div>`;
    $('#selectedContactList').append(htmlContent);
  }

  function refreshSelectBox() {
    $('#selectBox').empty();
    moAtoZList = [];
    var init = '';
    var optGrp = '';
    for (var i = 0, iLen = contactObjArr.length; i < iLen; i++) {
      var sortItem = contactObjArr[i][sortBy];
      var firstLetter = sortItem.substr(0,1);
      if ((sortBy === 'firstName' || sortBy === 'lastName') && init !== firstLetter) {
        optGrp = 'optGrp' + firstLetter.toUpperCase();
        $('#selectBox').append('<optgroup id="'+optGrp+'" label="'+firstLetter.toUpperCase()+'">');
        moAtoZList.push(firstLetter.toUpperCase());
        init = firstLetter;
      }
      addToSelectBox(optGrp, contactObjArr[i], i);
    }
    refreshMoAtoZList();
  }

  function refreshMoAtoZList() {
    $('#atoz-select').empty();
    for (var i = 0, iLen = moAtoZList.length; i < iLen; i++) {
      $('#atoz-select').append('<div id="atoz-'+moAtoZList[i]+'" class="atoz-select-item"> '+moAtoZList[i]+'</div>');
      $('.atoz-select-item')
      .mouseover( function(event) {
        $(this).css('font-weight', 'bold');

        var selectedLetter = (event.target.id).substr(5,1);
        var selectedIndex = findFirstOccurance(selectedLetter);
        var selecctedPhone = contactObjArr[selectedIndex].phone;
        var total = $('#selectBox option').length;
        var scrollHeight = document.getElementById("selectBox").scrollHeight;
        var itemHeight = scrollHeight / total;
        $('#selectBox').val(selecctedPhone).scrollTop(itemHeight * selectedIndex) ;
        return false;
      }).mouseout(function(){

        return false;
      }).mouseleave(function(){
          $(this).css('font-weight', 'inherit');
        return false;
      });;
    }
  }

  function addToSelectBox(optGrp, contact, index) {
    var optionText = contact.firstName + ' ' +contact.lastName + ' - ' + formatPhone(contact.phone);
    var optionTag = '<option class="option" value="'+contact.phone+'" >'+ optionText +'</option>';
    if (optGrp) {
      $('#selectBox #'+optGrp).append(optionTag);
    } else {
      $('#selectBox').append(optionTag);
    }
  }

  function toggleSortOrder() {
    sortOrder = (!sortOrder || sortOrder === 'asc') ? 'dsc' : 'asc';
    $('#lblSortOrder').html(sortOrder.toUpperCase());
  }

  function sortContacts() {
    contactObjArr.sort(function(a,b){
      if(a[sortBy] < b[sortBy]) return (sortOrder === 'dsc') ? 1 : -1;
      if(a[sortBy] > b[sortBy]) return (sortOrder === 'dsc') ? -1 : 1;
      return 0;
    });
  }

  function formatPhone(phone) {
    return phone.replace(/^(.+)*(\d\d\d)(\d\d\d)(\d\d\d\d)$/, '$1 ($2) $3-$4').replace('()','');
  }
