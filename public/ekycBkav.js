(function (window) {
        let bkavEKYC = {};
        let showPortraitAuthGuideElement = null;
        let typeCard = 0;
        let accessToken = ""
        let cardName = ""
        let faceNumber = 0
        let isLiveDetection = false
        let ratioViewCamera = 0
        let rootElement = ""
        let elementAfterLogout = ""
        let intervalTimeTakePhoto = null;
        let ratioDoneLiveDetection = 25
        const LOCAL_STORAGE_KEYS = {
            IS_DISPLAY_GUIDE: "isDisplayGuide",
            IS_DISPLAY_PORTRAIT_AUTH_GUIDE: "isDisplayPortraitAuthGuide",
            IS_DISPLAY_LIVE_DETECTION_GUIDE: "isDisplayLiveDetectionGuide",
            TRANSACTION_ID: "transactionId",
            POSITION_CURRENT_TAB: "positionCurrentTab",
            TYPE_CARD: "typeCard",
            NAME_CARD: "nameCard",
            FACE_NUMBER: "faceNumber",
            RATIO_VIEW_CAMERA: "ratioViewCamera",
            FRONT_DOCUMENT_INFO: "frontDocumentInfo",
            FRONT_DOCUMENT_MESSAGE: "frontDocumentMessage",
            FRONT_DOCUMENT_BASE64: "frontDocumentBase64",
            BACK_DOCUMENT_INFO: "backDocumentInfo",
            BACK_DOCUMENT_MESSAGE: "backDocumentMessage",
            BACK_DOCUMENT_BASE64: "backDocumentBase64",
            FACE_BASE64: "faceBase64",
            FACE_MESSAGE: "faceMessage",
            IS_FRONT_DOCUMENT_ERROR: "isFrontError",
            IS_BACK_DOCUMENT_ERROR: "isErrorBack",
            IS_FACE_ERROR: "isErrorFace",
        }
        const URLS = {
            DOMAIN_SERVER_URL: "https://apiekyc.demozone.vn",
            GET_TRANSACTION_ID_URL: "/core-manager/getTransactionId",
            GET_IDENTITY_DOCUMENT_URL: "/core-manager/getIndentityDocument",
            UPLOAD_PERSONAL_PAPER_FRONT_URL: "/core-manager/upload-personal-paper-front?transactionId=",
            UPLOAD_PERSONAL_PAPER_BACK_URL: "/core-manager/upload-personal-paper-back?transactionId=",
            GET_IDENTITY_DOCUMENT_BY_ID_URL: "/core-manager/getIndentityDocumentById/",
            FACE_MATCHING_URL: "/core-manager/face-matching?transactionId=",
            FACE_MATCHING_LIVE_DETECTION_URL: "/core-manager/verify_liveness?transactionId=",
            CALL_BACK_URL: "/core-manager/call-back"
        }
        const PARAM_API = {
            RECEIVE_IMAGE: "receiveImage",
            FACE_LEFT: "fileLeft",
            FACE_CENTER: "fileMid",
            FACE_RIGHT: "fileRight",
            INPUT_FILE: "file"
        }
        const ID_ATTRIBUTES = {
            PORTRAIT_AUTHENTICATION_ID: "portrait-authentication",
            DOCUMENT_FRONT_ID: "document-front",
            DOCUMENT_VERIFY_BACK_ID: "document-back",
            VIEW_CAMERA_ID: "view-camera",
            LIST_DOCUMENT_EKYC_ID: "list-document-ekyc",
            VIEW_LOADING_ID: 'view-loading',
            DOCUMENT_VERIFY_BACK_RESULT_ID: "result-document-verify-back",
            DOCUMENT_VERIFY_FRONT_RESULT_ID: "result-document-verify-front",
            FACE_VERIFY_RESULT_ID: "portrait-auth-result",
            DOCUMENT_VERIFY_RESULT_ID: "result-document-verify",
            BACK_PORTRAIT_AUTH_RESULT_ID: "back-portrait-auth-result",
            ICON_RESULT_ID: "icon-result",
            TEXT_RESULT_ID: 'text-result',
            IMG_VIEW_RESULT_ID: "img-view-result",
            IMG_PORTRAIT_AUTH_RESULT_ID: "img-result-portrait-auth",
            FRONT_ID: "-front",
            BACK_ID: "-back",
            PORTRAIT_AUTH_ID_SUFFIX: "-portrait-authentication",
            INFO_TAKE_PHOTO_AUTO_ID: "info-take-photo-auto",
            BUTTON_TAKE_PHOTO_ID: "button-take-photo",
            BUTTON_TAKE_PHOTO_MOBILE_ID: "button-take-photo-mobile",
            BUTTON_COME_BACK_ID: "btn-come-back",
            BUTTON_FAIL_DOCUMENT_VERIFY_ID: "btn-fail-document-verify",
            TITLE_DOCUMENT: 'title-document',
            BTN_TAKE_PHOTO_PORTRAIT: 'btn-take-photo-portrait',
            POPUP_ERROR: 'error-popup',
            BTN_CLOSE: 'btn-close'
        }
        const TEXT_VALUES = {
            TITLE_SUFFIX_FACE_FRONT: "mặt trước",
            TITLE_SUFFIX_FACE_BACK: "mặt sau",
            FLEX: "flex",
            NONE: "none",
            BLOCK: "block",
            VALUE_TRUE: "true",
            UNIT_PX: "px",
            STYLE_ATTRIBUTE: 'style'
        }
        const MESSAGES = {
            FACE_IN_FRAME: "Xin vui lòng đưa khuôn mặt vào khung hình",
            FACE_TO_RIGHT: "Xin vui lòng quay mặt từ từ sang phải >>>",
            FACE_TO_LEFT: "<<< Xin vui lòng quay mặt từ từ sang trái",
            WAIT_TAKE_PHOTO: "Xin vui lòng giữ yên trong 2s",
            FACE_CENTER: "Xin vui lòng nhìn thẳng",
            FACE_CLOSER: "Xin vui lòng đưa khuôn mặt lại gần hơn",
            FACE_FURTHER: "Xin vui lòng đưa khuôn mặt ra xa hơn",
            TITLE_NOT_FOUND_CAMERA: "Lỗi không tìm thấy camera",
            TITLE_ERROR_CONNECT: "Lỗi kết nối",
            CANT_ACCESS_CAMERA: 'Không có quyền truy cập vào camera...',
            INFO_REFRESH: "<div>Đang thực hiện quá trình xác thực.<div> Quý khách có chắc chắn muốn làm mới trang?</div>",
            NOT_FOUND_CAMERA: "<div>Thiết bị không có camera hoặc không ổn định</div><div> Quý khách vui lòng kiểm tra và thử lại </div>",
            CHOOSE_FILE_ERROR: "<div>Không đúng định dạng Ảnh</div><div>Quý khách vui lòng chọn lại ảnh</div>",
            INTERNET_INTERRUPTION: "<div>Kết nối mạng không có hoặc không ổn định</div><div> Quý khách vui lòng kiểm tra và thử lại </div>",
            SERVER_INTERRUPTION: "<div>Đã có lỗi xảy ra</div><div> Quý khách vui lòng thử lại sau </div>",
            ERROR_OTHER: "Đã có lỗi trong quá trình xác thực<br>Vui lòng thử lại sau ít phút",
        };
        const HTTP_STATUS = {
            SUCCESS: "OK",
            CANT_CONNECT_SERVER: 500,
            TOKEN_EXPIRED: 401,
        };
        const FOCAL = {
            CLOSER: 60,
            FURTHER: 140,
            CENTER: 40,
        }
        const INDEXES = {
            INDEX_EYE_RIGHT: 0,
            INDEX_EYE_LEFT: 1,
            INDEX_MOUTH: 3,
            INDEX_EAR_RIGHT: 4,
            INDEX_EAR_LEFT: 5,
            INDEX_MAX_FACE_NUMBER_DOCUMENT: 2,
            INDEX_MIN_FACE_NUMBER_DOCUMENT: 1,
            INDEX_TAB_CAMERA_FRONT: 0,
            INDEX_TAB_RESULT_FRONT: 1,
            INDEX_TAB_CAMERA_BACK: 2,
            INDEX_TAB_RESULT_BACK: 3,
            INDEX_TAB_CAMERA_FACE: 4,
            INDEX_TAB_RESULT_FACE: 5,
        }
        const WIDTH_VIEW_CAMERA = 343
        const COUNT_TIMER_TAKE_PHOTO = 10
        let CIRCLE_LENGTH = 48 * Math.PI * 2; // 48 la radius cua hinh tron
        // const text html
        const TEXTS = {
            TEXT_COME_BACK: "Quay lại",
            UNDERSTAND: "Tôi đã hiểu",
            SHOW_GUIDE: "Xem hướng dẫn",
            TAKE_PHOTO_AGAIN: "Chụp lại",
            AFTER_FACE_PHOTO: "Chụp mặt sau",
            CONTINUE: "Tiếp tục",
            TRY_AGAIN: "Thử lại",
            CONTINUE_AUTHENTICATION: "Tiếp tục xác thực",
            REFRESH_PAGE: "Làm mới trang",
            CLOSE: "Đóng",
        }
        const DOCUMENT_SELECTION_PAGE_TEXTS = {
            HEADER: "Chọn loại giấy tờ",
            BODY_TITLE: "Vui lòng chọn 1 loại giấy tờ sau!",
        }
        const PHOTOGRAPHY_GUIDE_PAGE_TEXTS = {
            HEADER: "Hướng dẫn chụp hình",
            LABEL_PLEASE_ENSURE: "Bạn vui lòng đảm bảo:",
            CONTENT_PLEASE_ENSURE_1: "Sử dụng giấy tờ thật, ảnh thật",
            CONTENT_PLEASE_ENSURE_2: "Ảnh chụp không bị mợ hoặc bóng",
            CONTENT_PLEASE_ENSURE_3: "Thông tin hiển thị rõ ràng, dễ đọc trong điều kiện <br/> đầy đủ ánh sáng",
            LABEL_AVOID_TAKE_PHOTO: "Cần tránh khi chụp:",
            CONTENT_AVOID_TAKE_PHOTO_1: "CMND bị mờ",
            CONTENT_AVOID_TAKE_PHOTO_2: "CMND quá tối",
            CONTENT_AVOID_TAKE_PHOTO_3: "CMND bị cắt góc",
        }
        const DOCUMENT_PHOTOGRAPHY_PAGE_TEXTS = {
            PLEASE: "Xin vui lòng",
            NOTE_DOCUMENT_PHOTOGRAPHY: 'Đặt giấy tờ vừa khung hình, chụp ảnh đủ sáng và rõ nét',
        }
        const PORTRAIT_AUTHENTICATION_PAGE_TEXTS = {
            HEADER: "Xác thực chân dung",
            NOTE_PORTRAIT_AUTHENTICATION: "Vui lòng đưa gương mặt vào khung hình"
        }
        const PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS = {
            HEADER: "Hướng dẫn xác thực chân dung",
            LABEL_PREPARE: "Chuẩn bị: ",
            CONTENT_PREPARE: "Để khuôn mặt vừa khớp với khung hình",
            LABEL_LOOK_STRAIGHT: "Nhìn thẳng: ",
            CONTENT_LOOK_STRAIGHT: " Đảm bảo ảnh rõ nét không bị mờ lóa, không đeo kính khi chụp",
            LABEL_TAKE_PHOTO: "Chụp hình: ",
            CONTENT_TAKE_PHOTO: "Nhấn vào nút chụp hình để kết thúc",
        }
        const DOCUMENT_AUTH_INFO_PAGE_TEXTS = {
            HEADER: "Thông tin giấy tờ",
            CARD_ID: "Số: ",
            FULL_NAME: "Họ và tên:",
            DATE_OF_BIRTHDAY: "Ngày sinh:",
            HOME_TOWN: "Nguyên quán:",
            PERMANENT_ADDRESS: "Thường trú:",
            EXPRIED: "Thời hạn:",
            DAY_OFF_ISSUE: "Ngày cấp:",
            PLACE_OFF_ISSUE: "Nơi cấp:",
            IDENTIFICATION_SIGN: "Đặc điểm nhận dạng:"
        }

        async function callApiMethodGet(apiUrl) {
            document.getElementById(ID_ATTRIBUTES.VIEW_LOADING_ID).style.display = TEXT_VALUES.BLOCK
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + accessToken);
            const requestOptions = {
                method: 'GET',
                headers: headers
            };
            let result = await fetch(URLS.DOMAIN_SERVER_URL + apiUrl, requestOptions)
                .then(response => {
                    document.getElementById(ID_ATTRIBUTES.VIEW_LOADING_ID).style.display = TEXT_VALUES.NONE
                    if (response.status === HTTP_STATUS.CANT_CONNECT_SERVER) {
                        popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.SERVER_INTERRUPTION)
                    }
                    if (response.status === HTTP_STATUS.TOKEN_EXPIRED) {
                        clearStorage()
                        logoutSDK()
                    }
                    return response.json()
                })
                .then(result => {
                    document.getElementById(ID_ATTRIBUTES.VIEW_LOADING_ID).style.display = TEXT_VALUES.NONE
                    return result;
                })
                .catch(error => {
                    document.getElementById(ID_ATTRIBUTES.VIEW_LOADING_ID).style.display = TEXT_VALUES.NONE
                    popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.INTERNET_INTERRUPTION)
                });
            return await result;
        }

        async function callApiMethodPost(apiUrl, body, nameFace) {
            let iconLoading = document.getElementById('icon-loading' + nameFace);
            iconLoading.style.display = TEXT_VALUES.FLEX
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + accessToken);
            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: body,
            };
            let result = await fetch(URLS.DOMAIN_SERVER_URL + apiUrl, requestOptions)
                .then(response => {
                    iconLoading.style.display = TEXT_VALUES.NONE
                    if (response.status === HTTP_STATUS.CANT_CONNECT_SERVER) {
                        popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.SERVER_INTERRUPTION)
                    }
                    if (response.status === HTTP_STATUS.TOKEN_EXPIRED) {
                        clearStorage()
                        logoutSDK()
                    }
                    return response.json()
                })
                .then(result => {
                    iconLoading.style.display = TEXT_VALUES.NONE
                    return result;
                })
                .catch(error => {
                    iconLoading.style.display = TEXT_VALUES.NONE
                    popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.INTERNET_INTERRUPTION)
                });
            return await result;
        }

        function b64toBlob(b64Data, nameFile, contentType, sliceSize) {
            contentType = contentType || "";
            sliceSize = sliceSize || 512;
            let byteCharacters = atob(b64Data);
            let byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                let slice = byteCharacters.slice(offset, offset + sliceSize);
                let byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                    byteNumbers[i] = slice.charCodeAt(i);
                }
                let byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            return new File(byteArrays, nameFile, {type: contentType});
        }

        function validateFile(file) {
            return ((file.type === 'image/jpg' || file.type === 'image/png' || file.type === 'image/jpeg') && file.size < 5000000)
        }

        function openCamera(nameFace, callBack) {
            let canvas = document.getElementById('canvas' + nameFace)
            let video = null
            // check camera
            let premise = navigator.mediaDevices.getUserMedia({video: true});
            premise.then(function (signal) {
                video = document.getElementById('player' + nameFace);
                let constraints = {audio: false, video: true}
                constraints.video = {
                    facingMode: 'environment'
                }
                navigator.mediaDevices
                    .getUserMedia(constraints)
                    .then((stream) => {
                        video.srcObject = stream;
                    }).catch(error => {
                    console.error(MESSAGES.CANT_ACCESS_CAMERA, error);
                });

                const takePhoto = (ev) => {
                    const context = canvas.getContext('2d');
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const data = canvas.toDataURL('image/png');
                    let dataBase64 = data.replace("data:image/png;base64,", "");
                    let fileData = b64toBlob(dataBase64, "bkav-ekyc.png", "image/png");
                    callBack(nameFace, fileData)
                    ev.preventDefault();
                }
                let buttonTakePhoto = document.getElementById(ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_ID + nameFace);
                let buttonTakePhotoMobile = document.getElementById(ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_MOBILE_ID + nameFace);
                buttonTakePhoto.addEventListener('click', takePhoto)
                buttonTakePhotoMobile && buttonTakePhotoMobile.addEventListener('click', takePhoto)
            }).catch(function (error) {
                let errorPopup = document.getElementById(ID_ATTRIBUTES.POPUP_ERROR);
                if (errorPopup && errorPopup.style.display === TEXT_VALUES.NONE || !errorPopup) {
                    popupError(MESSAGES.TITLE_NOT_FOUND_CAMERA, MESSAGES.NOT_FOUND_CAMERA)
                }
            })
        }


        function popupError(title, content) {
            let popup =
                "<div class='modal-guide' id='" + ID_ATTRIBUTES.POPUP_ERROR + "'>" +
                "<div class='container-modal'>" +
                "<div class='modal'>" +
                "<div class='title-modal' id='error-title'></div>" +
                "<div class='error-content' id='error-content'></div>" +
                "<div class='button-understand' id='" + ID_ATTRIBUTES.BTN_CLOSE + "'><span>" + TEXTS.CLOSE + "</span></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            let errorPopup = document.getElementById(ID_ATTRIBUTES.POPUP_ERROR);
            if (errorPopup == null) {
                document.getElementById(rootElement).insertAdjacentHTML('beforeend', popup)
                let errorPopup = document.getElementById(ID_ATTRIBUTES.POPUP_ERROR);
                document.getElementById("error-title").innerHTML = title;
                document.getElementById("error-content").innerHTML = content;
                let btnClose = document.getElementById(ID_ATTRIBUTES.BTN_CLOSE)
                btnClose.addEventListener('click', function () {
                    errorPopup.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: none !important;');
                })
            } else {
                errorPopup.style.display = TEXT_VALUES.FLEX
                document.getElementById(ID_ATTRIBUTES.BTN_CLOSE).innerHTML = TEXTS.CLOSE
                document.getElementById("error-title").innerHTML = title;
                document.getElementById("error-content").innerHTML = content;
            }
        }

        function createFontFace(fontUrl) {
            let newStyle = document.createElement(TEXT_VALUES.STYLE_ATTRIBUTE);
            newStyle.appendChild(document.createTextNode(`@font-face { font-family: 'user selection'; src: url('${fontUrl}');}`));
            document.head.appendChild(newStyle);
        }

        function popupRefresh(title, content, callbackYes) {
            let popup =
                "<div class='modal-guide' id='suggest-popup'>" +
                "<div class='container-modal'>" +
                "<div class='modal'>" +
                "<div class='title-modal' id='suggest-title'></div>" +
                "<div class='error-content' id='suggest-content'></div>" +
                "<div class='foot-popup'><div class='button button-refresh' id='btn-yes'><span>" + TEXTS.REFRESH_PAGE + "</span>" +
                "</div> <div class='button button-cancel-refresh' id='btn-no'>" + TEXTS.CONTINUE_AUTHENTICATION + "</div></div>" +
                "</div>" +
                "</div>" +
                "</div>"
            let suggestPopup = document.getElementById('suggest-popup');
            if (suggestPopup == null) {
                document.getElementById(rootElement).insertAdjacentHTML('beforeend', popup)
                let suggestPopup = document.getElementById('suggest-popup');
                document.getElementById("suggest-title").innerHTML = title;
                document.getElementById("suggest-content").innerHTML = content;
                let btnYes = document.getElementById('btn-yes')
                btnYes.addEventListener('click', function () {
                    suggestPopup.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: none !important;');
                    callbackYes()
                })
                let btnClose = document.getElementById('btn-no')
                btnClose.addEventListener('click', function () {
                    suggestPopup.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: none !important;');
                })
            } else {
                suggestPopup.style.display = TEXT_VALUES.FLEX;
                document.getElementById("suggest-title").innerHTML = title;
                document.getElementById("suggest-content").innerHTML = content;
            }
        }

        function clearStorage() {
            localStorage.clear();
            localStorage.setItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_GUIDE, TEXT_VALUES.VALUE_TRUE);
            localStorage.setItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_PORTRAIT_AUTH_GUIDE, TEXT_VALUES.VALUE_TRUE);
            // create session
            getNewTransactionId()
        }

        function logoutSDK() {
            document.getElementById(rootElement).style.display = TEXT_VALUES.BLOCK;
            let element = document.getElementById(rootElement);
            element.style.height = null;
            element.style.width = null;
            while (element.firstChild) {
                element.removeChild(element.firstChild);
            }
            document.getElementById(elementAfterLogout).style.display = TEXT_VALUES.BLOCK;
        }

        function getNewTransactionId() {
            let transactionId = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTION_ID);
            if (transactionId == null || transactionId.length === 0) {
                callApiMethodGet(URLS.GET_TRANSACTION_ID_URL).then(response => {
                    localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTION_ID, response.data);
                });
            }
        }

        function updatePercentDoneLiveDetection(percent) {
            let ratioDone = document.getElementById('ratio-take-done')
            for (let i = ratioDoneLiveDetection; i < percent; i++) {
                let countLength = CIRCLE_LENGTH - CIRCLE_LENGTH * i / 100
                ratioDone.setAttribute('stroke-dashoffset', countLength.toString())
            }
            let countLength = CIRCLE_LENGTH - CIRCLE_LENGTH * percent / 100
            ratioDone.setAttribute('stroke-dashoffset', countLength.toString())
            ratioDoneLiveDetection = percent
        }

        function openCameraFaceMatching(callbackFile) {
            let model;
            let countRefresh = 0
            let imgLeft = null
            let imgRight = null
            let imgCenter = null
            let infoFaceNeed = MESSAGES.FACE_TO_LEFT
            let video = document.getElementById("player" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX);
            let canvas = document.getElementById("canvas" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX)
            let result = document.getElementById(ID_ATTRIBUTES.INFO_TAKE_PHOTO_AUTO_ID)
            let btTakePhotoFace = document.getElementById(ID_ATTRIBUTES.BTN_TAKE_PHOTO_PORTRAIT)
            let ctx = canvas.getContext("2d");
            const setupCamera = () => {
                navigator.mediaDevices.getUserMedia({video: {width: 168, height: 168}, audio: false})
                    .then((stream) => {
                        video.srcObject = stream
                    }).catch(function (error) {
                        let errorPopup = document.getElementById(ID_ATTRIBUTES.POPUP_ERROR);
                        if (errorPopup && errorPopup.style.display === TEXT_VALUES.NONE || !errorPopup) {
                            popupError(MESSAGES.TITLE_NOT_FOUND_CAMERA, MESSAGES.NOT_FOUND_CAMERA)
                        }
                        let photo = document.getElementById('photo-avt')
                        if (photo) {
                            photo.style.display = TEXT_VALUES.BLOCK
                            result.innerHTML = ""
                        }
                    }
                )
            }
            const takePhoto = () => {
                const context = canvas.getContext('2d');
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                let data = canvas.toDataURL('image/png');
                let dataBase64 = data.replace("data:image/png;base64,", "");
                return b64toBlob(dataBase64, "bkav-ekyc.png", "image/png");
            }
            const detecFaces = async () => {
                if (imgCenter !== null && imgLeft !== null && imgRight !== null) {
                    if (intervalTimeTakePhoto !== null) {
                        clearInterval(intervalTimeTakePhoto);
                        intervalTimeTakePhoto = null
                    }
                    callbackFile(imgRight, imgCenter, imgLeft)
                    return
                }
                const prediction = await model.estimateFaces(video, false)
                if (prediction.length === 0) {
                    result.innerHTML = MESSAGES.FACE_IN_FRAME
                }
                prediction.forEach((pred) => {
                    let width = pred.bottomRight[0] - pred.topLeft[0]
                    let height = pred.bottomRight[1] - pred.topLeft[1]
                    ctx.rect(pred.topLeft[0], pred.topLeft[1], width, height)
                    let isNotCondition = false
                    result.innerHTML = infoFaceNeed
                    if (width < FOCAL.CLOSER) {
                        result.innerHTML = MESSAGES.FACE_CLOSER
                        isNotCondition = true
                    }
                    if (width > FOCAL.FURTHER) {
                        result.innerHTML = MESSAGES.FACE_FURTHER
                        isNotCondition = true
                    }
                    if (height < FOCAL.CENTER) {
                        result.innerHTML = MESSAGES.FACE_IN_FRAME
                        isNotCondition = true
                    }
                    if (!isNotCondition) {
                        let landmark = pred.landmarks
                        if (landmark.length !== 0) {
                            // toa độ
                            let rightEye = landmark[INDEXES.INDEX_EYE_RIGHT]
                            let leftEye = landmark[INDEXES.INDEX_EYE_LEFT]
                            let mouth = landmark[INDEXES.INDEX_MOUTH]
                            let rightEar = landmark[INDEXES.INDEX_EAR_RIGHT]
                            let leftEar = landmark[INDEXES.INDEX_EAR_LEFT]
                            let isConditionRight = imgRight === null && (leftEye[0] > leftEar[0] - 5)
                            if (countRefresh !== 0) {
                                result.innerHTML = MESSAGES.WAIT_TAKE_PHOTO
                            }
                            if (isConditionRight) {
                                result.innerHTML = MESSAGES.FACE_TO_LEFT
                                countRefresh = countRefresh + 1
                                if (countRefresh > COUNT_TIMER_TAKE_PHOTO) {
                                    countRefresh = 0
                                    imgRight = takePhoto()
                                    infoFaceNeed = MESSAGES.FACE_TO_RIGHT
                                    updatePercentDoneLiveDetection(ratioDoneLiveDetection + 25)
                                }
                            }
                            let isConditionLeft = (imgLeft === null && imgRight !== null) && (rightEye[0] < rightEar[0] + 5)
                            if (isConditionLeft) {
                                result.innerHTML = MESSAGES.FACE_TO_RIGHT
                                countRefresh = countRefresh + 1
                                if (countRefresh > COUNT_TIMER_TAKE_PHOTO) {
                                    countRefresh = 0
                                    imgLeft = takePhoto()
                                    infoFaceNeed = MESSAGES.FACE_CENTER
                                    updatePercentDoneLiveDetection(ratioDoneLiveDetection + 25)
                                }
                            }
                            let position_mouth = (leftEar[0] - rightEar[0]) / 2 + rightEar[0]
                            let isConditionCenter = (imgCenter === null && imgLeft !== null && imgRight !== null) && (position_mouth - 10 < mouth[0] && mouth[0] < position_mouth + 10)
                            if (isConditionCenter) {
                                result.innerHTML = MESSAGES.FACE_CENTER
                                countRefresh = countRefresh + 1
                                if (countRefresh > COUNT_TIMER_TAKE_PHOTO) {
                                    countRefresh = 0
                                    imgCenter = takePhoto()
                                    infoFaceNeed = MESSAGES.FACE_TO_LEFT
                                    result.innerHTML = MESSAGES.FACE_IN_FRAME
                                    updatePercentDoneLiveDetection(ratioDoneLiveDetection + 25)
                                    ratioDoneLiveDetection = 25
                                }
                            }
                        }
                    }
                })
            }
            setupCamera()
            if (isLiveDetection) {
                result.style.display = TEXT_VALUES.BLOCK
                btTakePhotoFace.style.display = TEXT_VALUES.NONE
                updatePercentDoneLiveDetection(ratioDoneLiveDetection)
                video.addEventListener("loadeddata", async () => {
                    model = await blazeface.load();
                    imgLeft = null
                    imgRight = null
                    imgCenter = null
                    if (intervalTimeTakePhoto === null) {
                        intervalTimeTakePhoto = setInterval(detecFaces, 200);
                    }
                })
            } else {
                result.style.display = TEXT_VALUES.NONE
                btTakePhotoFace.style.display = TEXT_VALUES.BLOCK
                let buttonTakePhoto = document.getElementById(ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_ID + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX);
                const takeCamera = () => {
                    let fileImg = takePhoto()
                    callbackFile(null, fileImg, null)
                }
                buttonTakePhoto && buttonTakePhoto.addEventListener('click', takeCamera)
            }
        }

        function liveDetectionGuide() {
            let guide =
                "<div class='modal-guide' id='modal-guide-live-detection'>" +
                "<div class='container-modal'>" +
                "<div class='modal modal-guide-live'>" +
                "<div class='title-modal' >Hướng dẫn quét nhận diện khuôn mặt</div>" +
                "<div class='title-modal-sub' >Thực hiện theo các bước hướng dẫn sau :</div>" +
                "<div class='container-guide-live'>" +
                "<div class='view-center'>" +
                "<div class='item-guide-live-detection'><img src='images/prepare-live-detection.svg' alt='icon'/> <div>1. Chuẩn bị</div></div>" +
                "<div class='item-guide-live-detection'><img src='images/left-live-detection.svg' alt='icon'/> <div>2. Nhìn sang bên trái</div></div>" +
                "</div>" +
                "<div class='view-center guide-live-mobile'>" +
                "<div class='item-guide-live-detection'><img src='images/right-live-detection.svg'/> <div>3. Nhìn sang bên phải</div></div>" +
                "<div class='item-guide-live-detection'><img src='images/center-live-detetion.svg'/> <div>4. Nhìn thẳng vào camera</div></div>" +
                "</div>" +
                "</div>" +
                "<div class='button-understand' id='btn-understand-live-detection'><span>Tôi đã hiểu</span></div>" +
                " </div>" +
                "</div>" +
                "</div>"

            let modalLiveDetectionGuide = document.getElementById('modal-guide-live-detection');
            if (modalLiveDetectionGuide == null) {
                document.getElementById(rootElement).insertAdjacentHTML('beforeend', guide)
                let modalGuide = document.getElementById('modal-guide-live-detection');
                let btnUnderstand = document.getElementById('btn-understand-live-detection')
                btnUnderstand.addEventListener('click', function () {
                    modalGuide.setAttribute('style', 'display: none');
                })
            }

            let isDisplayPortraitAuthGuide = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_LIVE_DETECTION_GUIDE);
            if (isDisplayPortraitAuthGuide == null) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_LIVE_DETECTION_GUIDE, TEXT_VALUES.VALUE_TRUE);
            } else {
                let modalGuide = document.getElementById('modal-guide-live-detection');
                modalGuide.setAttribute('style', 'display: none;');
            }
        }

        // your sdk init function
        bkavEKYC.init = function (initObj, callbackVerify) {
            // set theme
            let rootThemeElement = document.querySelector(':root');
            let styles = initObj.STYLES;
            for (const styleKey in styles) {
                if (styles[styleKey] !== "") {
                    rootThemeElement.style.setProperty(`--${styleKey}`, styles[styleKey]);
                }
            }
            createFontFace(initObj.STYLES.url_font_family)

            function portraitAuthenticationGuide() {
                // popup huong dan xac thuc chan dung
                let guide =
                    "<div class='modal-guide' id='modal-portrait-authentication-guide'>" +
                    "<div class='container-modal'>" +
                    "<div class='modal'>" +
                    "<div class='title-modal' >" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.HEADER + "</div>" +
                    "<div class='container-guide portrait'>" +
                    "<div class='item-guide'><img class='number-step' src='images/portrait-authentication-step-1.svg' alt='icon'/> " +
                    "<div>" +
                    "<span class='item_title'><span class='label-step'>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.LABEL_PREPARE + " " +
                    "</span>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.CONTENT_PREPARE + "</span></div></div>" +
                    "<div class='item-guide'><img class='number-step' src='images/portrait-authentication-step-2.svg' alt='icon'/>" +
                    "<div><span class='item_title'><span class='label-step'>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.LABEL_LOOK_STRAIGHT + " " +
                    "</span>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.CONTENT_LOOK_STRAIGHT + "</span></div></div>" +
                    "<div class='item-guide'><img class='number-step' src='images/portrait-authentication-step-3.svg' alt='icon'/>" +
                    "<div><span class='item_title'><span class='label-step'>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.LABEL_TAKE_PHOTO + " " +
                    "</span>" + PORTRAIT_AUTHENTICATION_GUIDE_PAGE_TEXTS.CONTENT_TAKE_PHOTO + "</span></div></div>" +
                    "</div>" +
                    "<div class='button-understand' id='btn-understand-portrait-guide'><span>" + TEXTS.UNDERSTAND + "</span></div>" +
                    " </div>" +
                    "</div>" +
                    "</div>"
                let modalGuide = document.getElementById('modal-portrait-authentication-guide');
                let isDisplayPortraitAuthGuide = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_PORTRAIT_AUTH_GUIDE);
                if (modalGuide == null) {
                    document.getElementById(rootElement).insertAdjacentHTML('beforeend', guide)
                    let modalGuide = document.getElementById('modal-portrait-authentication-guide');
                    showPortraitAuthGuideElement = modalGuide;
                    if (isDisplayPortraitAuthGuide == null) {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_PORTRAIT_AUTH_GUIDE, TEXT_VALUES.VALUE_TRUE);
                        modalGuide.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: flex;');
                    } else {
                        modalGuide.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: none;');
                    }
                    let btnUnderstand = document.getElementById('btn-understand-portrait-guide')
                    btnUnderstand.addEventListener('click', function () {
                        modalGuide.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: none');
                    })
                } else {
                    if (isDisplayPortraitAuthGuide == null) {
                        modalGuide.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: flex');
                    }
                }
            }

            function portraitAuthentication() {
                // page xac thuc khuon mat
                if (isLiveDetection) {
                    liveDetectionGuide()
                } else {
                    portraitAuthenticationGuide()
                }
                localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FACE.toString());
                let portraitAuthenticationPage =
                    "<div id='" + ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID + "'>" +
                    "<div class='document-selection-page'>" +
                    "<div class='title-page'>" +
                    "<div id='back-portrait-authentication-page' class='back'>" +
                    "<img src='images/icon_back.svg' class='icon-back'/>" +
                    "<span class='text-back'><span class='text-back'> " + TEXTS.TEXT_COME_BACK + " </span> </span></div> " +
                    "<div class='title'>" + PORTRAIT_AUTHENTICATION_PAGE_TEXTS.HEADER + "</div>" +
                    "</div>" +
                    "<div class='content-container'>" +
                    "<div class='title-body'>" + PORTRAIT_AUTHENTICATION_PAGE_TEXTS.NOTE_PORTRAIT_AUTHENTICATION + "</div>" +
                    "<div class='btn-show-guide' id='show-guide'> " + TEXTS.SHOW_GUIDE + " </div>" +
                    "<div class='portrait-container'>" +
                    "<svg width='182px' height='182px' viewBox='0 0 100 100' style='transform: rotate(-90deg)'>" +
                    "<circle class='circle-background' cx='50' cy='50' r='48' stroke-width='3px' />" +
                    "<circle class='circle-progress'  cx='50' cy='50' r='48' stroke-width='3px' id='ratio-take-done'/>" +
                    "<div class='view-center icon-loading icon-loading-portrait' id='icon-loading" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX + "' style='display: none'>" +
                    "<img src='images/icon-loading.svg' class='icon-portrait-result'/></div>" +
                    "<canvas class='canvas-camera canvas-camera-portrait' id='canvas" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX + "'></canvas>" +
                    "<video id='player" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX + "' class='view-camera view-camera-portrait' autoplay></video>" +
                    "<img src='' id='img-document" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX + "' alt='' style='display: none'/>" +
                    "<img id='photo-avt' src='images/img-photo-place.svg' class='view-full'/>" +
                    "</svg>" +
                    "</div>" +
                    // "<div class=''><img class='photo-avt' src='images/img-photo-place.svg'/></div>" +
                    "<div id='" + ID_ATTRIBUTES.INFO_TAKE_PHOTO_AUTO_ID + "' class='message-result'></div>" +
                    "<div class='btn-take-photo' id='" + ID_ATTRIBUTES.BTN_TAKE_PHOTO_PORTRAIT + "'>" +
                    "<img class='photo-avt' src='images/icon_camera.svg' id='" + ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_ID + "" + ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX + "'/></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                let portraitAuthElement = document.getElementById(ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID)
                let homeVerifyElement = document.getElementById('home-verify-document');
                if (homeVerifyElement) {
                    homeVerifyElement.style.display = TEXT_VALUES.NONE
                }
                if (portraitAuthElement == null) {
                    document.getElementById(rootElement).insertAdjacentHTML('beforeend', portraitAuthenticationPage)
                    let btnShowGuide = document.getElementById('show-guide')
                    btnShowGuide.addEventListener('click', function () {
                        if (isLiveDetection) {
                            let modalGuideLive = document.getElementById('modal-guide-live-detection');
                            modalGuideLive.style.display = TEXT_VALUES.FLEX
                        } else {
                            showPortraitAuthGuideElement.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: flex !important;');
                        }
                    })
                    openCameraFaceMatching(callBackFace)
                    document.getElementById('photo-avt').style.display = TEXT_VALUES.NONE
                } else {
                    portraitAuthElement.style.display = TEXT_VALUES.BLOCK;
                    if (isLiveDetection) {
                        openCameraFaceMatching(callBackFace)
                    }
                }
                document.getElementById("back-portrait-authentication-page").addEventListener('click', function () {
                    document.getElementById(ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID).style.display = TEXT_VALUES.NONE
                    if (Number(faceNumber) === INDEXES.INDEX_MAX_FACE_NUMBER_DOCUMENT) {
                        document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_RESULT_ID).style.display = TEXT_VALUES.BLOCK
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_BACK.toString());
                    } else {
                        document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_FRONT_RESULT_ID).style.display = TEXT_VALUES.BLOCK
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_FRONT.toString());
                    }
                    if (isLiveDetection && intervalTimeTakePhoto !== null) {
                        clearInterval(intervalTimeTakePhoto);
                        intervalTimeTakePhoto = null
                    }
                })
            }

            function portraitAuthResult(isError, message) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_FACE.toString());
                let portraitAuthResultPage =
                    "<div id='" + ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID + "'>" +
                    "<div class='document-selection-page'>" +
                    "<div class='title-page'>" +
                    "<div id='" + ID_ATTRIBUTES.BACK_PORTRAIT_AUTH_RESULT_ID + "' class='back'>" +
                    "<img class='icon-back' src='images/icon_back.svg'/>" +
                    "<span class='text-back'><span class='text-back'> " + TEXTS.TEXT_COME_BACK + " </span> </span></div> " +
                    "<div class='title'>" + PORTRAIT_AUTHENTICATION_PAGE_TEXTS.HEADER + "</div>" +
                    "</div>" +
                    "<div class='content-container'>" +
                    "<div class='img-result'>" +
                    "<img class='img-portrait-result' src='images/img-photo-place.svg' id='" + ID_ATTRIBUTES.IMG_PORTRAIT_AUTH_RESULT_ID + "' alt=''/>" +
                    "<img src='' class='icon-result' id='" + ID_ATTRIBUTES.ICON_RESULT_ID + "'  >" +
                    "</div>" +
                    "<div class='message-result' id='message-result'></div>" +
                    "<div class='button-understand btn-next' id='btn-portrait-auth-next'><span>" + TEXTS.CONTINUE + "</span></div>" +
                    "<div class='container-btn-portrait-result' id='container-btn-portrait-result'>" +
                    "<div class='button-understand button-retry' id='btn-portrait-retry'><span>Thử lại</span></div>" +
                    "<div class='button-understand' id='btn-fail-portrait-next'><span>" + TEXTS.CONTINUE + "</span></div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"

                let portraitResult = document.getElementById(ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID);
                if (portraitResult == null) {
                    document.getElementById(rootElement).insertAdjacentHTML('beforeend', portraitAuthResultPage)
                } else {
                    portraitResult.setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, 'display: flex');
                }
                let btnPortraitNext = document.getElementById('btn-portrait-auth-next');
                let elementBtnResultFail = document.getElementById('container-btn-portrait-result');
                let messageResult = document.getElementById('message-result');
                let imgResultPortraitAuth = document.getElementById(ID_ATTRIBUTES.IMG_PORTRAIT_AUTH_RESULT_ID);
                let iconResult = document.getElementById(ID_ATTRIBUTES.ICON_RESULT_ID)
                if (isError) {
                    iconResult.setAttribute('src', "images/icon_error.svg")
                    elementBtnResultFail.style.display = TEXT_VALUES.FLEX;
                    btnPortraitNext.style.display = TEXT_VALUES.NONE;
                    messageResult.style.color = "#EC2222";
                    imgResultPortraitAuth.style.border = '#EC2222 solid 2px';
                } else {
                    iconResult.setAttribute('src', "images/icon_success.svg")
                    btnPortraitNext.style.display = TEXT_VALUES.FLEX;
                    elementBtnResultFail.style.display = TEXT_VALUES.NONE;
                    messageResult.style.color = "#1967B2";
                    imgResultPortraitAuth.style.border = '#1967B2 solid 2px';
                }
                messageResult.innerHTML = message;
                iconResult.style.display = TEXT_VALUES.BLOCK;
                setTimeout(function () {
                    iconResult.style.display = TEXT_VALUES.NONE;
                }, 2000)

                btnPortraitNext && btnPortraitNext.addEventListener('click', function f() {
                    if (isError !== true) {
                        resultVerify()
                    }
                })
                let btnPortraitAuthFailNext = document.getElementById('btn-fail-portrait-next');
                btnPortraitAuthFailNext && btnPortraitAuthFailNext.addEventListener('click', function f() {
                    resultVerify()
                })
                let btnPortraitRetry = document.getElementById("btn-portrait-retry")
                let portraitAuthResult = document.getElementById(ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID)
                let portraitAuthentication = document.getElementById(ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID)
                btnPortraitRetry && btnPortraitRetry.addEventListener('click', function f() {
                    portraitAuthResult.style.display = TEXT_VALUES.NONE
                    portraitAuthentication.style.display = TEXT_VALUES.BLOCK
                    if (isLiveDetection) {
                        openCameraFaceMatching(callBackFace)
                    }
                    localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FACE.toString());
                })
                let backPortraitAuthResult = document.getElementById(ID_ATTRIBUTES.BACK_PORTRAIT_AUTH_RESULT_ID)
                backPortraitAuthResult && backPortraitAuthResult.addEventListener('click', function f() {
                    portraitAuthResult.style.display = TEXT_VALUES.NONE
                    let viewListDocument = document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID)
                    if (viewListDocument) {
                        viewListDocument.style.display = TEXT_VALUES.BLOCK
                    } else {
                        document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID).style.display = TEXT_VALUES.FLEX
                    }
                    localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, "");
                })
            }

            // call Back chup anh / chon file
            function callBackFace(fileLeft, fileMid, fileRight) {
                function callBackUploadFile(response) {
                    let status = response.status
                    if (status !== HTTP_STATUS.SUCCESS) {
                        let errorPopup = document.getElementById(ID_ATTRIBUTES.POPUP_ERROR);
                        if (errorPopup && errorPopup.style.display === TEXT_VALUES.NONE || !errorPopup) {
                            popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.ERROR_OTHER)
                            document.getElementById(ID_ATTRIBUTES.BTN_CLOSE).innerHTML = TEXTS.TRY_AGAIN
                        }
                    } else {
                        let message = response.message
                        let isError = response.data === false
                        portraitAuthResult(isError, message)
                        document.getElementById(ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID).style.display = TEXT_VALUES.NONE;
                        document.getElementById(ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID).style.display = TEXT_VALUES.BLOCK;
                        localStorage.setItem(LOCAL_STORAGE_KEYS.FACE_MESSAGE, message)
                        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_FACE_ERROR, isError.toString())
                        let reader = new FileReader();
                        reader.onload = function (e) {
                            document.getElementById(ID_ATTRIBUTES.IMG_PORTRAIT_AUTH_RESULT_ID).setAttribute('src', reader.result)
                            localStorage.setItem(LOCAL_STORAGE_KEYS.FACE_BASE64, reader.result)
                        }
                        reader.readAsDataURL(fileMid);
                    }
                }

                // call api
                let transactionId = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTION_ID);
                const formData = new FormData();
                let urlFaceMatching = ""
                if (isLiveDetection) {
                    formData.append(PARAM_API.FACE_LEFT, fileLeft, fileLeft.name);
                    formData.append(PARAM_API.FACE_CENTER, fileMid, fileMid.name);
                    formData.append(PARAM_API.FACE_RIGHT, fileRight, fileRight.name);
                    urlFaceMatching = URLS.FACE_MATCHING_LIVE_DETECTION_URL
                } else {
                    formData.append(PARAM_API.INPUT_FILE, fileMid, fileMid.name);
                    urlFaceMatching = URLS.FACE_MATCHING_URL
                }
                callApiMethodPost(urlFaceMatching + transactionId, formData, ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX).then(response => {
                    callBackUploadFile(response)
                })
            }

            function resultVerify() {
                let transactionId = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTION_ID);
                const formData = new FormData();
                formData.append(LOCAL_STORAGE_KEYS.TRANSACTION_ID, transactionId);
                formData.append(PARAM_API.RECEIVE_IMAGE, TEXT_VALUES.VALUE_TRUE);
                callApiMethodPost(URLS.CALL_BACK_URL, formData, ID_ATTRIBUTES.PORTRAIT_AUTH_ID_SUFFIX).then(response => {
                    if (response.status === HTTP_STATUS.SUCCESS) {
                        document.getElementById(rootElement).style.display = TEXT_VALUES.NONE;
                        callbackVerify(response)
                        clearStorage()
                    } else {
                        popupError(MESSAGES.TITLE_ERROR_CONNECT, MESSAGES.SERVER_INTERRUPTION)
                    }

                });
                return null
            }

            function callAPIUpload(url, file, callBackUploadFile, nameFace) {
                const formData = new FormData();
                formData.append("file", file, file.name);
                callApiMethodPost(url, formData, nameFace).then(response => {
                    callBackUploadFile(response)
                })
            }

            function guideDocument() {
                // modal huong dan chup hinh
                let guide =
                    "<div class='modal-guide modal-guide-document' id='modal-document-guide'>" +
                    "<div class='container-modal'>" +
                    "<div class='modal'>" +
                    "<div class='title-modal' >" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.HEADER + "</div>" +
                    "<div class='container-guide'>" +
                    "<div class='label-modal'>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.LABEL_PLEASE_ENSURE + "</div>" +
                    "<div class='item-guide'><img class='number-step' src='images/icon-check.svg' alt='icon'/>" +
                    "<div class='item-title'><span>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_PLEASE_ENSURE_1 + "</span></div></div>" +
                    "<div class='item-guide'><img class='number-step' src='images/icon-check.svg' alt='icon'/>" +
                    "<div class='item-title'><span >" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_PLEASE_ENSURE_2 + "</span></div></div>" +
                    "<div class='item-guide'><img class='number-step' src='images/icon-check.svg' alt='icon'/>" +
                    "<div class='item-title'><span>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_PLEASE_ENSURE_3 + "</span></div></div>" +
                    "</div>" +
                    "<div class='label-modal'>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.LABEL_AVOID_TAKE_PHOTO + "</div>" +
                    "<div class='container-warning-img'>" +
                    "<div class='item-content'>" +
                    "<img class='number-step error-img' src='images/blurred-image-error.svg' alt='icon'/>" +
                    "<div class='content-img'>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_AVOID_TAKE_PHOTO_1 + "</div>" +
                    "</div>" +
                    "<div class='item-content'>" +
                    "<img class='number-step error-img' src='images/dark-photo-error.svg' alt='icon'/>" +
                    "<div class='content-img'>" + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_AVOID_TAKE_PHOTO_2 + "</div>" +
                    "</div>" +
                    "<div class='item-content'>" +
                    "<img class='number-step error-img' src='images/corner-crop-error.svg' alt='icon'/>" +
                    "<div class='content-img'> " + PHOTOGRAPHY_GUIDE_PAGE_TEXTS.CONTENT_AVOID_TAKE_PHOTO_3 + "</div>" +
                    "</div>" +
                    "</div>" +
                    "<div class='button-understand' id='button-understand'><span>" + TEXTS.UNDERSTAND + "</span></div>" +
                    " </div>" +
                    "</div>" +
                    "</div>"
                let guideDocumentElement = document.getElementById("modal-document-guide")
                if (guideDocumentElement == null) {
                    document.getElementById(rootElement).insertAdjacentHTML('beforeend', guide)
                    let modalGuide = document.getElementById('modal-document-guide');
                    let btnUnderstand = document.getElementById("button-understand")
                    btnUnderstand && btnUnderstand.addEventListener("click", (function () {
                        modalGuide.style.display = TEXT_VALUES.NONE
                        let viewListDocument = document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID)
                        if (viewListDocument) {
                            viewListDocument.style.display = TEXT_VALUES.NONE
                        }
                        // verifyDocument(typeCard, numberFace, tokenKey, tokenId)
                        let viewFace = document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID)
                        if (!viewFace) {
                            verifyDocument()
                        }
                    }));
                } else {
                    guideDocumentElement.style.display = TEXT_VALUES.FLEX;
                }
            }

            function documentInformation(nameFace) {
                if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                    return "<div  class='result-information' id='result-information" + nameFace + "'> " +
                        "<div class='document-title-info'> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.HEADER + " </div>" +
                        "<div class='info-document-item'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.CARD_ID + " </div>" +
                        "<div class='info-item' id='id_card'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.FULL_NAME + " </div>" +
                        "<div class='info-item' id='full_name'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.DATE_OF_BIRTHDAY + " </div>" +
                        "<div class='info-item' id='date_of_birth'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.HOME_TOWN + " </div>" +
                        "<div class='info-item' id='home_town'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div class='label-info'> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.PERMANENT_ADDRESS + " </div>" +
                        "<div class='info-item' id='permanent_address'> </div>" +
                        "</div>" +
                        "<div class='info-document-item' id='expriry-info' style='display: none'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.EXPRIED + " </div>" +
                        "<div class='info-item' id='expiry'> </div>" +
                        "</div>" +
                        "</div>"
                } else {
                    return "<div  class='result-information' id='result-information" + nameFace + "'>" +
                        "<div class='document-title-info'> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.HEADER + " </div>" +
                        "<div class='info-document-item'>" +
                        "<div> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.DAY_OFF_ISSUE + " </div>" +
                        "<div class='info-item' id='day_of_issue'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div class='label-info' > " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.PLACE_OFF_ISSUE + " </div>" +
                        "<div class='info-item' id='place_of_issue'> </div>" +
                        "</div>" +
                        "<div class='info-document-item'>" +
                        "<div class='identification-sign'> " + DOCUMENT_AUTH_INFO_PAGE_TEXTS.IDENTIFICATION_SIGN + " </div>" +
                        "<div class='info-item' id='identification_sign'> </div>" +
                        "</div>" +
                        "</div>"
                }
            }

            function resultDocumentVerify(title, isError, message, nameFace, data) {
                let viewElement = "<div id='" + ID_ATTRIBUTES.DOCUMENT_VERIFY_RESULT_ID + "" + nameFace + "'>" +
                    "<div class='document-selection-page'>" +
                    "<div class='title-page'><div id='back" + nameFace + "' class='back'>" +
                    "<img class='icon-back' src='images/icon_back.svg'/> " +
                    "<span class='text-back'><span class='text-back'> " + TEXTS.TEXT_COME_BACK + " </span> </span>" +
                    "</div> <div class='title' id='title-result-document-" + nameFace + "'>" + title + "</div></div>" +
                    "<div class='body-result-document-verify'>" +
                    "<div class='result-document-container'>" +
                    "<div>" +
                    "<div class='view-result' id='view-result" + nameFace + "'>" +
                    "<img id='" + ID_ATTRIBUTES.IMG_VIEW_RESULT_ID + "" + nameFace + "' src='images/document_default.svg'  class='img-document-result' alt=''>" +
                    "<img src='' class='icon-result' id='" + ID_ATTRIBUTES.ICON_RESULT_ID + "" + nameFace + "'  >" +
                    "</div>" +
                    "<div class='text-result' id='" + ID_ATTRIBUTES.TEXT_RESULT_ID + nameFace + "'>" + message + "</div>" +
                    "</div>" +
                    "<div class='text-info-container' id='information-verify-success" + nameFace + "'></div>" +
                    "</div>" +
                    "<div class='button-take-photo fail-document-verify' " +
                    "id='" + ID_ATTRIBUTES.BUTTON_FAIL_DOCUMENT_VERIFY_ID + nameFace + "' style='display: none' >" + TEXTS.TAKE_PHOTO_AGAIN + "</div>" +
                    "<div id='success-document-verify" + nameFace + "' class='success-verify' style='display: none' >" +
                    "<div id='button-take-again" + nameFace + "' class='button-take-again'>" + TEXTS.TAKE_PHOTO_AGAIN + " </div>" +
                    "<div class='button-take-photo next-camera-back' id='next-camera-back" + nameFace + "' > " + TEXTS.AFTER_FACE_PHOTO + " </div> " +
                    "</div>" +
                    "</div>" +
                    "</div></div></div>"
                let resultDocumentVerify = document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_RESULT_ID + nameFace)
                if (resultDocumentVerify) {
                    resultDocumentVerify.style.display = TEXT_VALUES.BLOCK
                } else {
                    document.getElementById(rootElement).insertAdjacentHTML('beforeend', viewElement)
                }
                document.getElementById('title-result-document-' + nameFace).innerHTML = title
                // closeCamera()
                let viewResult = document.getElementById(ID_ATTRIBUTES.IMG_VIEW_RESULT_ID + nameFace)
                let textResult = document.getElementById(ID_ATTRIBUTES.TEXT_RESULT_ID + nameFace)
                let documentInfoSuccess = document.getElementById('information-verify-success' + nameFace)
                let iconResult = document.getElementById(ID_ATTRIBUTES.ICON_RESULT_ID + nameFace)
                let buttonFailDocumentVerify = document.getElementById(ID_ATTRIBUTES.BUTTON_FAIL_DOCUMENT_VERIFY_ID + nameFace)
                let buttonSuccessDocumentVerify = document.getElementById('success-document-verify' + nameFace)
                if (isError) {
                    textResult.style.display = TEXT_VALUES.BLOCK;
                    textResult.innerHTML = message
                    viewResult.style.border = '#EC2222 solid 2px';
                    textResult.style.color = '#EC2222 '
                    iconResult.setAttribute('src', "images/icon_error.svg")
                    buttonSuccessDocumentVerify.style.display = TEXT_VALUES.NONE
                    buttonFailDocumentVerify.style.display = TEXT_VALUES.FLEX
                    documentInfoSuccess.style.display = TEXT_VALUES.NONE
                } else {
                    iconResult.setAttribute('src', "images/icon_success.svg")
                    viewResult.style.border = '#1967B2 solid 2px';
                    textResult.style.display = TEXT_VALUES.NONE
                    buttonSuccessDocumentVerify.style.display = TEXT_VALUES.FLEX
                    buttonFailDocumentVerify.style.display = TEXT_VALUES.NONE
                    documentInfoSuccess.style.display = TEXT_VALUES.BLOCK
                    documentInfoSuccess.innerHTML = documentInformation(nameFace)
                    if (nameFace === ID_ATTRIBUTES.BACK_ID) {
                        document.getElementById('day_of_issue').innerText = data.day_of_issue
                        document.getElementById('place_of_issue').innerText = data.place_of_issue
                        document.getElementById('identification_sign').innerText = data.identification_sign
                    } else {
                        document.getElementById('id_card').innerText = data.id_card
                        document.getElementById('full_name').innerText = data.full_name
                        document.getElementById('date_of_birth').innerText = data.day_of_birth
                        document.getElementById('home_town').innerText = data.home_town
                        document.getElementById('permanent_address').innerText = data.permanent_address
                        if (parseInt(localStorage.getItem(LOCAL_STORAGE_KEYS.TYPE_CARD)) === 2) {
                            document.getElementById('expriry-info').setAttribute(TEXT_VALUES.STYLE_ATTRIBUTE, TEXT_VALUES.FLEX + '!important')
                            document.getElementById('expiry').innerText = data.expiry
                        }
                    }
                }
                iconResult.style.display = TEXT_VALUES.BLOCK
                setTimeout(function () {
                    iconResult.style.display = TEXT_VALUES.NONE;
                }, 2000)

                let buttonTakeAgain = document.getElementById("button-take-again" + nameFace)
                buttonTakeAgain && buttonTakeAgain.addEventListener('click', function () {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_RESULT_ID + nameFace).style.display = TEXT_VALUES.NONE
                    document.getElementById("document" + nameFace).style.display = TEXT_VALUES.FLEX
                    localStorage.removeItem(nameFace.replace('-', '') + 'DocumentInfo');
                    if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FRONT.toString());
                    } else {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_BACK.toString());
                    }
                })

                let nextCameraBack = document.getElementById("next-camera-back" + nameFace)
                if (nameFace === ID_ATTRIBUTES.BACK_ID || Number(faceNumber)===INDEXES.INDEX_MIN_FACE_NUMBER_DOCUMENT) {
                    nextCameraBack.innerHTML = "Tiếp tục"
                }
                nextCameraBack && nextCameraBack.addEventListener('click', function () {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_RESULT_ID + nameFace).style.display = TEXT_VALUES.NONE
                    if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                        if (Number(faceNumber) === INDEXES.INDEX_MAX_FACE_NUMBER_DOCUMENT) {
                            title = cardName + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_BACK
                            let faceBack = document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_ID)
                            if (faceBack) {
                                faceBack.style.display = TEXT_VALUES.FLEX
                                let viewCamera = document.getElementById(ID_ATTRIBUTES.VIEW_CAMERA_ID + ID_ATTRIBUTES.BACK_ID)
                                viewCamera.style.width = WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                                viewCamera.style.height = ratioViewCamera * WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                                document.getElementById(ID_ATTRIBUTES.TITLE_DOCUMENT + ID_ATTRIBUTES.BACK_ID).innerHTML = title
                            } else {
                                homeVerifyDocument(title, ID_ATTRIBUTES.BACK_ID, callBack)
                                localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_BACK.toString());
                            }
                        } else {
                            portraitAuthentication()
                        }
                    } else {
                        portraitAuthentication()
                    }
                })

                let resultDocumentVerifyElement = document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_RESULT_ID + nameFace)
                let failDocumentVerify = document.getElementById(ID_ATTRIBUTES.BUTTON_FAIL_DOCUMENT_VERIFY_ID + nameFace)
                let documentFace = document.getElementById("document" + nameFace)
                failDocumentVerify && failDocumentVerify.addEventListener('click', function () {
                    resultDocumentVerifyElement.style.display = TEXT_VALUES.NONE
                    documentFace.style.display = TEXT_VALUES.FLEX
                    localStorage.removeItem(nameFace.replace('-', '') + 'DocumentInfo');
                    if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FRONT.toString());
                    } else {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_BACK.toString());
                    }
                })

                let buttonBack = document.getElementById('back' + nameFace)
                buttonBack && buttonBack.addEventListener('click', function () {
                    resultDocumentVerifyElement.style.display = TEXT_VALUES.NONE
                    document.getElementById("document" + nameFace).style.display = TEXT_VALUES.FLEX
                    if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FRONT.toString());
                    } else {
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_BACK.toString());
                    }
                })
            }

            function homeVerifyDocument(title, nameFace, callbackFile) {
                let viewElement = "<div class='document' id='document" + nameFace + "'>" +
                    "<div class='title-page document-title'>" +
                    "<div id='" + ID_ATTRIBUTES.BUTTON_COME_BACK_ID + "" + nameFace + "' class='back'>" +
                    "<img class='icon-back' src='images/icon_back.svg'/>" +
                    "<span class='text-back'><span class='text-back'> " + TEXTS.TEXT_COME_BACK + " </span> </span>" +
                    "</div> " +
                    "<div class='title document-title' id='title-document" + nameFace + "'>" + title + "</div>" +
                    "</div>" +
                    "<div class='home-verify-document-front'>" +
                    "<div class='view-camera-body'>" +
                    "<canvas class='canvas-camera' id='canvas" + nameFace + "'></canvas>" +
                    "<video id='player" + nameFace + "' class='view-camera' autoplay></video>" +
                    "<div class='view-center view-camera-dim' >" +
                    "<svg id='" + ID_ATTRIBUTES.VIEW_CAMERA_ID + "" + nameFace + "' ><rect rx='24' class='view-camera-focus'/></svg>" +
                    "</div>" +
                    "<div class='view-guide'>" +
                    "<div class='note'><div>" + DOCUMENT_PHOTOGRAPHY_PAGE_TEXTS.PLEASE + "</div> " +
                    "<div style='margin-top: 5px;'>" + DOCUMENT_PHOTOGRAPHY_PAGE_TEXTS.NOTE_DOCUMENT_PHOTOGRAPHY + "</div>" +
                    "</div>" +
                    "<div class='guide'><div class='button-guide' id='buttonGuideDocument" + nameFace + "'>" + TEXTS.SHOW_GUIDE + "</div></div>" +
                    "</div>" +
                    "<div id='loading-container' class='loading-container'>" +
                    "<div class='view-center icon-loading' id='icon-loading" + nameFace + "' style='display: none'>" +
                    "<img src='images/icon-loading.svg' class='icon-portrait-result'/>" +
                    "</div>" +
                    "</div>" +
                    "<div class='view'>" +
                    "</div>" +
                    "<div class='view-camera-foot web' ><div class='view-take-photo'>" +
                    "<img id='" + ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_ID + "" + nameFace + "' src='images/icon_camera.svg' alt=''/> " +
                    "</div> " +
                    "<div id='button-upload-file" + nameFace + "' > <img src='images/icon_choose_file.svg' alt=''/> " +
                    "<input hidden type='file' id='input-choose-file" + nameFace + "' accept='.jpg, .png, .jpeg'></div></div>" +
                    "</div>" +
                    "<div class='view-camera-foot mobile' >" +
                    "<div class='view-take-photo'>" +
                    "<img id='" + ID_ATTRIBUTES.BUTTON_TAKE_PHOTO_MOBILE_ID + nameFace + "' src='images/icon_camera.svg' alt=''/> " +
                    "</div> " +
                    "<div id='button-upload-file-mobile" + nameFace + "' > " +
                    "<img src='images/icon_choose_file.svg' alt=''/> " +
                    "<input hidden type='file' id='input-choose-file" + nameFace + "' accept='.jpg, .png, .jpeg'>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                document.getElementById(rootElement).insertAdjacentHTML('beforeend', viewElement)

                let viewCamera = document.getElementById(ID_ATTRIBUTES.VIEW_CAMERA_ID + nameFace)
                viewCamera.style.width = WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                viewCamera.style.height = ratioViewCamera * WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                // bat camera
                openCamera(nameFace, callbackFile)
                // choose file
                const chooseFile = () => {
                    let inputChooseFile = document.getElementById('input-choose-file' + nameFace);
                    inputChooseFile.value = "";
                    inputChooseFile.click()
                    inputChooseFile.onchange = function (e) {
                        if (inputChooseFile.files && inputChooseFile.files[0]) {
                            if (validateFile(inputChooseFile.files[0])) {
                                callbackFile(nameFace, inputChooseFile.files[0])
                            } else {
                                popupError("", MESSAGES.CHOOSE_FILE_ERROR)
                            }
                        }
                    };
                }
                let buttonUploadFile = document.getElementById("button-upload-file" + nameFace)
                let buttonUploadFileMobile = document.getElementById("button-upload-file-mobile" + nameFace)
                buttonUploadFile && buttonUploadFile.addEventListener('click', chooseFile)
                buttonUploadFileMobile && buttonUploadFileMobile.addEventListener('click', chooseFile)

                // button guide
                let buttonGuideDocumentBack = document.getElementById('buttonGuideDocument' + nameFace)
                buttonGuideDocumentBack && buttonGuideDocumentBack.addEventListener("click", (function () {
                    guideDocument()
                }));
                // button quay lại mặt trước
                let buttonBackFront = document.getElementById(ID_ATTRIBUTES.BUTTON_COME_BACK_ID + ID_ATTRIBUTES.FRONT_ID)
                buttonBackFront && buttonBackFront.addEventListener("click", (function () {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID).style.display = TEXT_VALUES.NONE
                    let viewListDocument = document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID)
                    if (viewListDocument) {
                        viewListDocument.style.display = TEXT_VALUES.BLOCK
                    } else {
                        clearStorage()
                        logoutSDK()
                    }
                    localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, "");
                }));
                // button quay lại mặt sau
                let buttonComeBackBack = document.getElementById(ID_ATTRIBUTES.BUTTON_COME_BACK_ID + ID_ATTRIBUTES.BACK_ID)
                buttonComeBackBack && buttonComeBackBack.addEventListener("click", (function () {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_ID).style.display = TEXT_VALUES.NONE
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_FRONT_RESULT_ID).style.display = TEXT_VALUES.BLOCK
                    localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_FRONT.toString());
                }));
                return viewElement
            }

            function chooseDocumentVerify() {
                return "<div id='" + ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID + "'><div class='document-selection-page'>" +
                    "<div class='title-page'>" +
                    "<div id='back-document-selection-page' class='back'><img class='icon-back' src='images/icon_back.svg'/>" +
                    "<span class='text-back'> " + TEXTS.TEXT_COME_BACK + " </span></div> " +
                    "<div class='title'>" + DOCUMENT_SELECTION_PAGE_TEXTS.HEADER + "</div></div>" +
                    "<div class='body-prepare-document'>" +
                    "<div class='title-body'>" + DOCUMENT_SELECTION_PAGE_TEXTS.BODY_TITLE + "</div>" +
                    "<div class='list-choose' id='list-choose'>" +
                    "</div>" +
                    "</div></div></div>"
            }

            function verifyDocument() {
                localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_CAMERA_FRONT.toString());
                let title = cardName
                if (Number(faceNumber) === INDEXES.INDEX_MAX_FACE_NUMBER_DOCUMENT) {
                    title = title + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_FRONT
                }
                let homeVerifyDocumentElement = document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID)
                if (homeVerifyDocumentElement) {
                    homeVerifyDocumentElement.style.display = TEXT_VALUES.FLEX
                    let viewCamera = document.getElementById(ID_ATTRIBUTES.VIEW_CAMERA_ID + ID_ATTRIBUTES.FRONT_ID)
                    viewCamera.style.width = WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                    viewCamera.style.height = ratioViewCamera * WIDTH_VIEW_CAMERA + TEXT_VALUES.UNIT_PX
                    document.getElementById(ID_ATTRIBUTES.TITLE_DOCUMENT + ID_ATTRIBUTES.FRONT_ID).innerHTML = title
                } else {
                    homeVerifyDocument(title, ID_ATTRIBUTES.FRONT_ID, callBack)
                }
                // create session
                getNewTransactionId()

            }

            // call Back chup anh / chon file
            function callBack(nameFace, fileUpload) {
                function callBackUploadFile(response) {
                    let isError = false
                    let info = {};
                    if (response.status !== HTTP_STATUS.SUCCESS) {
                        isError = true
                    } else {
                        info = response.data
                    }
                    let message = response.message
                    document.getElementById('document' + nameFace).style.display = TEXT_VALUES.NONE;
                    let title = cardName
                    if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                        if (Number(faceNumber) === INDEXES.INDEX_MAX_FACE_NUMBER_DOCUMENT) {
                            title = title + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_FRONT
                        }
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_FRONT.toString());
                        localStorage.setItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_MESSAGE, message);
                        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_FRONT_DOCUMENT_ERROR, isError.toString());
                        localStorage.setItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_INFO, JSON.stringify(info));
                    } else {
                        title = title + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_BACK
                        localStorage.setItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB, INDEXES.INDEX_TAB_RESULT_BACK.toString());
                        localStorage.setItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_MESSAGE, message);
                        localStorage.setItem(LOCAL_STORAGE_KEYS.IS_BACK_DOCUMENT_ERROR, isError.toString());
                        localStorage.setItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_INFO, JSON.stringify(info));
                    }

                    resultDocumentVerify(title, isError, message, nameFace, response.data)
                    let reader = new FileReader();
                    reader.onload = function (e) {
                        document.getElementById(ID_ATTRIBUTES.IMG_VIEW_RESULT_ID + nameFace).setAttribute('src', reader.result)
                        if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                            localStorage.setItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_BASE64, reader.result)
                        } else {
                            localStorage.setItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_BASE64, reader.result)
                        }

                    }
                    reader.readAsDataURL(fileUpload);
                }

                let transactionId = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTION_ID);
                if (nameFace === ID_ATTRIBUTES.FRONT_ID) {
                    callAPIUpload(URLS.UPLOAD_PERSONAL_PAPER_FRONT_URL + transactionId + "&typeId=" + typeCard, fileUpload, callBackUploadFile, nameFace)
                } else {
                    callAPIUpload(URLS.UPLOAD_PERSONAL_PAPER_BACK_URL + transactionId + "&typeId=" + typeCard, fileUpload, callBackUploadFile, nameFace)
                }
            }

            function startVerifyDocument() {
                let isDisplayGuide = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_GUIDE);
                let portraitAuthElement = document.getElementById(ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID)
                if (portraitAuthElement) {
                    portraitAuthElement.style.display = TEXT_VALUES.NONE
                }
                if (isDisplayGuide == null) {
                    localStorage.setItem(LOCAL_STORAGE_KEYS.IS_DISPLAY_GUIDE, TEXT_VALUES.VALUE_TRUE);
                    guideDocument()
                } else {
                    let documentListElement = document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID)
                    if (documentListElement) {
                        documentListElement.style.display = TEXT_VALUES.NONE
                    }
                    verifyDocument()
                }
            }

            function backTabBeforeRefresh() {
                let positionTab = localStorage.getItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB);
                let tabPositionIdName = ""
                positionTab = Number(positionTab) + 1
                // setup info
                typeCard = localStorage.getItem(LOCAL_STORAGE_KEYS.TYPE_CARD);
                cardName = localStorage.getItem(LOCAL_STORAGE_KEYS.NAME_CARD);
                faceNumber = localStorage.getItem(LOCAL_STORAGE_KEYS.FACE_NUMBER);
                ratioViewCamera = Number(localStorage.getItem(LOCAL_STORAGE_KEYS.RATIO_VIEW_CAMERA));
                let titleFront = cardName
                if (Number(faceNumber) === INDEXES.INDEX_MAX_FACE_NUMBER_DOCUMENT) {
                    titleFront = titleFront + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_FRONT
                }

                let isNotBack = false
                if (positionTab > INDEXES.INDEX_TAB_CAMERA_FRONT) {
                    homeVerifyDocument(titleFront, ID_ATTRIBUTES.FRONT_ID, callBack)
                    isNotBack = true
                    tabPositionIdName = ID_ATTRIBUTES.DOCUMENT_FRONT_ID
                }
                if (positionTab > INDEXES.INDEX_TAB_RESULT_FRONT) {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID).style.display = TEXT_VALUES.NONE
                    let messageFront = localStorage.getItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_MESSAGE);
                    let frontDocumentInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_INFO));
                    let frontDocumentBase64 = localStorage.getItem(LOCAL_STORAGE_KEYS.FRONT_DOCUMENT_BASE64);
                    let isErrorFront = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_FRONT_DOCUMENT_ERROR) === TEXT_VALUES.VALUE_TRUE;
                    resultDocumentVerify(titleFront, isErrorFront, messageFront, ID_ATTRIBUTES.FRONT_ID, frontDocumentInfo)
                    document.getElementById(ID_ATTRIBUTES.IMG_VIEW_RESULT_ID + ID_ATTRIBUTES.FRONT_ID).setAttribute('src', frontDocumentBase64)
                    isNotBack = true
                    tabPositionIdName = ID_ATTRIBUTES.DOCUMENT_VERIFY_FRONT_RESULT_ID
                }

                if (positionTab > INDEXES.INDEX_TAB_CAMERA_BACK) {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_FRONT_RESULT_ID).style.display = TEXT_VALUES.NONE
                    let titleBack = cardName + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_BACK
                    homeVerifyDocument(titleBack, ID_ATTRIBUTES.BACK_ID, callBack)
                    isNotBack = true
                    tabPositionIdName = ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_ID
                }

                if (positionTab > INDEXES.INDEX_TAB_RESULT_BACK) {
                    let titleBack = cardName + " " + TEXT_VALUES.TITLE_SUFFIX_FACE_BACK
                    let messageBack = localStorage.getItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_MESSAGE);
                    let backDocumentInfo = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_INFO));
                    let backDocumentBase64 = localStorage.getItem(LOCAL_STORAGE_KEYS.BACK_DOCUMENT_BASE64);
                    let isErrorBack = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_BACK_DOCUMENT_ERROR) === TEXT_VALUES.VALUE_TRUE;
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_ID).style.display = TEXT_VALUES.NONE
                    if (backDocumentInfo !== null) {
                        resultDocumentVerify(titleBack, isErrorBack, messageBack, ID_ATTRIBUTES.BACK_ID, backDocumentInfo)
                        document.getElementById(ID_ATTRIBUTES.IMG_VIEW_RESULT_ID + ID_ATTRIBUTES.BACK_ID).setAttribute('src', backDocumentBase64)
                        isNotBack = true
                        tabPositionIdName = ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_RESULT_ID
                    }
                }

                if (positionTab > INDEXES.INDEX_TAB_CAMERA_FACE) {
                    document.getElementById(ID_ATTRIBUTES.DOCUMENT_VERIFY_BACK_RESULT_ID).style.display = TEXT_VALUES.NONE
                    portraitAuthentication()
                    isNotBack = true
                    tabPositionIdName = ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID
                }

                if (positionTab > INDEXES.INDEX_TAB_RESULT_FACE) {
                    document.getElementById(ID_ATTRIBUTES.PORTRAIT_AUTHENTICATION_ID).style.display = TEXT_VALUES.NONE
                    let messageFace = localStorage.getItem(LOCAL_STORAGE_KEYS.FACE_MESSAGE);
                    let faceBase64 = localStorage.getItem(LOCAL_STORAGE_KEYS.FACE_BASE64);
                    let isErrorFace = localStorage.getItem(LOCAL_STORAGE_KEYS.IS_FACE_ERROR) === TEXT_VALUES.VALUE_TRUE;
                    portraitAuthResult(isErrorFace, messageFace)
                    document.getElementById(ID_ATTRIBUTES.IMG_PORTRAIT_AUTH_RESULT_ID).setAttribute('src', faceBase64)
                    isNotBack = true
                    tabPositionIdName = ID_ATTRIBUTES.FACE_VERIFY_RESULT_ID
                }
                if (isNotBack) {
                    // hidden giao dien chon giay to
                    function callBackYes() {
                        document.getElementById(tabPositionIdName).style.display = TEXT_VALUES.NONE;
                        let viewListDocument = document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID)
                        if (viewListDocument) {
                            viewListDocument.style.display = TEXT_VALUES.BLOCK;
                        } else {
                            document.getElementById(ID_ATTRIBUTES.DOCUMENT_FRONT_ID).style.display = TEXT_VALUES.FLEX
                        }
                        clearStorage()
                    }

                    popupRefresh("", MESSAGES.INFO_REFRESH, callBackYes)
                }
            }


            // get data init
            accessToken = initObj.ACCESS_TOKEN;
            rootElement = initObj.PARENT_ID
            typeCard = initObj.TYPE_CARD
            isLiveDetection = initObj.IS_LIVE_DETECTION
            elementAfterLogout = initObj.VIEW_ID_AFTER_LOGOUT_SDK
            let root = document.getElementById(rootElement);
            root.style.background = initObj.STYLES.background
            root.style.width = '100%'
            root.style.height = '100%'
            let element = "<div style='display: none' id='" + ID_ATTRIBUTES.VIEW_LOADING_ID + "'><div id='loading'  >" +
                "<img src='images/loading.svg' alt=''/></div></div>"
            root.insertAdjacentHTML("beforeend", element)
            let isTypeCardExist = typeCard !== null && typeCard.toString().length > 0 && typeCard !== 0
            if (isTypeCardExist) {
                localStorage.setItem(LOCAL_STORAGE_KEYS.TYPE_CARD, typeCard);
                callApiMethodGet(URLS.GET_IDENTITY_DOCUMENT_BY_ID_URL + typeCard.toString()).then(dataDocument => {
                    let itemDocument = dataDocument.data
                    cardName = itemDocument.name
                    faceNumber = itemDocument.number
                    ratioViewCamera = Number(itemDocument.height) / Number(itemDocument.width)
                    localStorage.setItem(LOCAL_STORAGE_KEYS.NAME_CARD, cardName);
                    localStorage.setItem(LOCAL_STORAGE_KEYS.FACE_NUMBER, faceNumber);
                    localStorage.setItem(LOCAL_STORAGE_KEYS.RATIO_VIEW_CAMERA, ratioViewCamera.toString());
                    if (Number(positionTab) === 0) {
                        startVerifyDocument()
                    }
                })
            } else {
                document.getElementById(rootElement).insertAdjacentHTML("beforeend", chooseDocumentVerify())
                let buttonBack = document.getElementById("back-document-selection-page")
                buttonBack && buttonBack.addEventListener('click', function () {
                    logoutSDK()
                })
                // call API lấy danh sách giấy tờ
                callApiMethodGet(URLS.GET_IDENTITY_DOCUMENT_URL).then(dataListDocument => {
                        let listData = dataListDocument.data
                        let listChoose = document.getElementById('list-choose')
                        for (let i = 0; i < listData.length; i++) {
                            let nameCard = listData[i].name
                            let cardID = listData[i].identitydocumentid
                            let numberFace = listData[i].number
                            let icon = listData[i].icon
                            if (icon === null) {
                                icon = "images/document_default.svg"
                            }
                            let elementCard = "<div class='item-document'  id='document-" + cardID + "' >" +
                                "<div class='item-document-icon'>" +
                                "<img onerror=\"this.onerror=null;this.src='../images/document_default.svg'\" src='" + icon + "' alt='icon' />" +
                                "</div> <div class='item-document-text'><span>" + nameCard + "</span></div> </div>"
                            listChoose.insertAdjacentHTML('beforeend', elementCard)
                            let cardDocument = document.getElementById('document-' + cardID)
                            cardDocument && cardDocument.addEventListener('click', function () {
                                typeCard = cardID;
                                cardName = nameCard
                                faceNumber = numberFace
                                localStorage.setItem(LOCAL_STORAGE_KEYS.TYPE_CARD, typeCard);
                                localStorage.setItem(LOCAL_STORAGE_KEYS.NAME_CARD, cardName);
                                localStorage.setItem(LOCAL_STORAGE_KEYS.FACE_NUMBER, faceNumber);
                                let ratio = Number(listData[i].height) / Number(listData[i].width)
                                ratioViewCamera = ratio
                                localStorage.setItem(LOCAL_STORAGE_KEYS.RATIO_VIEW_CAMERA, ratio.toString());
                                startVerifyDocument()
                            })
                        }
                    }
                );
            }
            let positionTab = localStorage.getItem(LOCAL_STORAGE_KEYS.POSITION_CURRENT_TAB);
            if (positionTab != null && positionTab.length !== 0) {
                if (!isTypeCardExist) {
                    document.getElementById(ID_ATTRIBUTES.LIST_DOCUMENT_EKYC_ID).style.display = TEXT_VALUES.NONE
                    backTabBeforeRefresh()
                } else {
                    if (Number(positionTab) !== 0) {
                        backTabBeforeRefresh()
                    }
                }
            }
        };
        // define your namespace myApp
        window.bkavEKYC = bkavEKYC;

    }

)
(window, undefined);