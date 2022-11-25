import Vue from "vue";
import ApiService from "@/core/services/api.service";
import sign from "jwt-encode"
import jwt_decode from 'jwt-decode'
import dayjs from 'dayjs'

const Helper = {
  globalHelper() {
    Vue.mixin({
      methods: {
        nikValidator(event, data) {
          if (data.length > 15) event.preventDefault();
          if (event.key.match(/[0-9]/g)) return event;
          else event.preventDefault();
        },
        getJWT(obj) {
          const secret = 'os5r6a!'
          return sign(obj, secret)
        },
        translateJWT(token) {
          const obj = jwt_decode(token)
          return obj
        },
        onlyDecimal(event) {
          const charCode = event.which ? event.which : event.keyCode;
          if (
            charCode != 46 &&
            charCode > 31 &&
            (charCode < 48 || charCode > 57)
          )
            event.preventDefault();
          return event;
        },
        onlyWord(event, lengthData = null, data = null) {
          if (event.key.match(/[a-zA-Z ]/g)) {
            if (lengthData === null) {
              return event
            }
            if (data.length < lengthData) {
              return event
            }
            event.preventDefault()
          } else {
            event.preventDefault()
          }
          return ''
        },
        onlyNumber(event, lengthData = null, data = null) {
          if (event.key.match(/[0-9]/g)) {
            if (lengthData == null) {
              return event;
            } else {
              if (data.length < lengthData) return event;
              else event.preventDefault();
            }
          } else event.preventDefault();
        },
        onlyNumberPreventPaste(event, lengthData = null, data = null) {
          const keys = event.key;
          const keysCtrl = event.ctrlKey;
          if (keysCtrl) return event.preventDefault();
          if (event.keyCode == 8 || event.keyCode == 46) return event;
          if (keys.match(/[0-9]/g)) {
            if (lengthData == null) return event;
            if (data.length < lengthData) return event;
          } else {
            event.preventDefault();
          }
        },
        preventAll(event) {
          const keys = event.key;
          const keysCtrl = event.ctrlKey;
          if (keys || keysCtrl ) return event.preventDefault();
        },
        decimalInput(event) {
          const { keyCode, key } = event;
          if (keyCode === 110 || keyCode === 46) return event;
          else if (key.match(/[0-9]/g)) return event;
          else event.preventDefault();
        },
        onlyAlphanumeric(event) {
          if (event.key.match(/^[a-zA-Z ]*$/)) return event;
          else event.preventDefault();
        },
        onlyCustom(event, lengthData = null, data = null, pattern) {
          const patternRegexp = new RegExp(pattern);
          if (event.key.match(patternRegexp)) {
            if (lengthData == null) {
              return event;
            } else {
              if (data.length < lengthData) return event;
              else event.preventDefault();
            }
          } else event.preventDefault();
        },
        currencyFormat(data = null) {
          const newData = parseFloat(data.replace(/,/g, ""));
          return newData.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        currencyToNumber(data = null) {
          return parseFloat(data.replace(/,/g, ""));
        },
        processingDate(string) {
          const date = string // 2021-07-15T14:11:41.956Z
          return this.$moment(date).format('LL') // 15 Juli 2021
        },
        processingIdProyek(string) { // R-202108211332517796385
          if (!string) return '-'
          const strNumber = string.split('-')[1].split('')
          strNumber.splice(6, 0, '-') // 202108-211332517796385
          strNumber.splice(11, 0, '-') // 202108-2113-32517796385
          strNumber.splice(16, 0, '-') // 202108-2113-32517796385
          strNumber.splice(21, 0, '-') // 202108-2113-3251-7796385
          return strNumber.join('')
        },
        formatDateToPicker(date) {
          if (!date) return null;

          const [year, month, day] = date.split("-");
          //this.register.tgl_lahir = `${day}-${month}-${year}`;
          return `${day}-${month}-${year}`;
        },
        spesialDateFormat (date) {
          if (!date) return null;
          
          const temp = date.split('-').reverse()
          temp.push('01')
          const result = temp.join('-') 
          return result
        },
        formatDateToPickerMonth(date) {
          if(!date) return null
          const [year,month,day] = date.split("-")
          return `${month}-${year}`

        },
        makeRandom(n) {
          let result = '';
          const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          const charactersLength = characters.length;
          for ( let i = 0; i < n; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
        },
        makeRandomAngka(n) {
          let result = '';
          const characters = '0123456789';
          const charactersLength = characters.length;
          for ( let i = 0; i < n; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
        },
        changeDateFormat (date) {
          const temp = date.split('-')
          switch (temp[1]) {
            case '01':
              temp[1] = 'Januari'
              break
            case '02':
              temp[1] = 'Februari'
              break
            case '03':
              temp[1] = 'Maret'
              break
            case '04':
              temp[1] = 'April'
              break
            case '05':
              temp[1] = 'Mei'
              break
            case '06':
              temp[1] = 'Juni'
              break
            case '07':
              temp[1] = 'Juli'
              break
            case '08':
              temp[1] = 'Agustus'
              break
            case '09':
              temp[1] = 'September'
              break
            case '10':
              temp[1] = 'Oktober'
              break
            case '11':
              temp[1] = 'November'
              break
            case '12':
              temp[1] = 'Desember'
              break
            default:
              break
          }
          return temp.reverse().join(' ')
        },
        convertDateToPicker(data = null) {
          if (data == null) {
            return this.$moment().format("YYYY-MM-DD");
          } else {
            const [year, month, day] = data.split("-");
            return `${year}-${month}-${day}`;
          }
        },
        convertDateToPicker2(data = null) {
          if (data == null) {
            return this.$moment().format("YYYY-MM-DD");
          } else {
            let date = new Date(data),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
            const valueConvert = [date.getFullYear(), mnth, day].join("-");
            return valueConvert
          }
        },
        convertDate(data) {
          const [year, month, day] = data.split("-");
          return `${year}${month}${day}`;
        },
        convertDateTime(str) {
          const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
          let date = new Date(str),
          mnth = bulan[date.getMonth()],
          day = ("0" + date.getDate()).slice(-2);
          const valueConvertDate = [day, mnth, date.getFullYear()].join(" ");
        
          let time = new Date(str),
          jam = ("0" + time.getHours()).slice(-2),
          menit = ("0" + time.getMinutes()).slice(-2),
          detik = ("0" + time.getSeconds()).slice(-2);
          const valueConvertTime = [jam, menit, detik].join(":");
        
          const datetime = [valueConvertDate, valueConvertTime].join(" ");
        
          return datetime
        },
        uppercaseLetterFirst(textInput) {
          textInput = textInput.toLowerCase();
          var stringArray = textInput.split(/\b(\s)/);
          for (var i = 0; i < stringArray.length; i++) {
            stringArray[i] =
              stringArray[i].charAt(0).toUpperCase() +
              stringArray[i].substring(1);
          }
          var finalText = stringArray.join("");
          return finalText;
        },
        uppercaseLetter(textInput) {
          let result = textInput.toUpperCase();
          return result;
        },
        currencyDotFormat(value) {
          if(value){
            var currency = value.match(/.{1,3}/g).join(".");
            var currency = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return currency;
          }
        },
        currencyDotFormatNumber(value) {
          if(value){
            var currency = value.toString().match(/.{1,3}/g).join(".");
            var currency = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return currency;
          }
        },
        npwpFormat(value){
          let result = ''
          for (let i = 0; i < value.length; i++) {
            result += value[i]
            if (i === 1 || i === 4 || i === 7 || i === 11) result += '.'
            if (i === 8 ) result += '-'
          }
          return result 
        },
        InvertnpwpFormat(value){
          let hasil, result
          hasil = value.replaceAll('.', '');
          result = hasil.replaceAll('-', '');
          return result 
        },
        replaceDots(data = null) {
          return data.replace(/\./g, "");
        },
        replaceComma(data = null) {
          return data.replace(/\,/g, "");
        },
        encodeBinary: function (blob) {
          return new Promise((resolve, reject) => {
            let reader = new FileReader();
            reader.onload = (event) => {
              resolve(event.target.result);
            };
            reader.onerror = (error) => {
              reader.abort();
              reject(error);
            };
            reader.readAsDataURL(blob);
          })
        },
        uuidv4: function () {
          return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          });
        },
        PrintcurrencyLanguageFormatter(nominal = '0') {
          let strNominal = nominal ? nominal.replace('.00', '') : '0';
          const lengthNominal = strNominal.length - 1;
          if (lengthNominal == 9) {
            return `${strNominal[0]}.${strNominal[1]} Miliar`;
          } else if (lengthNominal == 12) {
            return `${strNominal[0]}.${strNominal[1]} Triliun`;
          } else if (lengthNominal == 15) {
            return `${strNominal[0]}.${strNominal[1]} Kuadriliun`;
          } else if (lengthNominal == 18) {
            return `${strNominal[0]}.${strNominal[1]} Kuintiliun`
          } else if (lengthNominal == 21) {
            return `${strNominal[0]}.${strNominal[1]} Sekstiliun`;
          } else if (lengthNominal == 24) {
            return `${strNominal[0]}.${strNominal[1]} Septiliun`;
          } else if (lengthNominal == 27) {
            return `${strNominal[0]}.${strNominal[1]} Oktiliun`;
          } else if (lengthNominal == 30) {
            return `${strNominal[0]}.${strNominal[1]} Noniliun`;
          } else if (lengthNominal == 33) {
            return `${strNominal[0]}.${strNominal[1]} Desiliun`;
          } else {
            return this.currencyDotFormat(strNominal);
          }
        },
        changeCurrencyLanguageFormatterInput(nominal = '0') {
          let strNominal = nominal ? nominal.replace('.00', '') : '0';
          let nominalRp = this.currencyDotFormat(strNominal);
          return nominalRp;
        },
        currencyCommaFormat(value) {
          if(value){
            var currency = value.match(/.{1,3}/g).join(",");
            var currency = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return currency;
          }
        },
        getDayJS(waktu, text) {
          let date = dayjs().add(waktu, text).toDate()
          return date;
        },
      },
    });
  },
};

export default Helper;
