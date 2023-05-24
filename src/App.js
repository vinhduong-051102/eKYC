import "antd/dist/antd.min.css";
import {Checkbox, Form, Input, Select} from "antd";
import ColorPicker from "./ColorPicker.tsx";
import './App.css';
import {useEffect, useState} from "react";
import {
    Back,
    BodyVerify,
    ButtonTryAgain,
    FootVerifyMobile, FootVerifyWeb,
    ImgVerify,
    InfoDocument,
    InfoVerifyDocument,
    InfoVerifyDocumentLeft,
    ItemDocument,
    ItemDocumentTitle, ItemDocumentTitleResult,
    ItemDocumentValue,
    ItemResult,
    ListImgVerify,
    NameTitle,
    ResultVerify,
    TextBack,
    Title
} from "./appStyles";
import iconBack from '../src/images/icon_back.svg'

const ShowResult = ({dataResult, onBack, onTryAgain}) => {
    // const isError= dataResult.status!=="OK"
    // if (isError){
    //     // todo hoi lai thiet ke
    //     alert(dataResult.status.message)
    // }
    const checkParamData = (value) => {
        if (value == null || value.length === 0) {
            return "Chưa có dữ liệu"
        }
        return value
    }
    const checkImgData = (value) => {
        if (value == null || value.length === 0) {
            return "images/document_default.svg"
        }
        return "data:image/png;base64," + value
    }
    return (<ResultVerify id="resultVerifyBkav">
        <Title> <Back onClick={onBack}><img src={iconBack} alt='icon' style={{marginRight: '8px'}}/><TextBack>Quay
            lại</TextBack></Back>
            <NameTitle>Kết quả xác thực</NameTitle></Title>
        <BodyVerify>
            <ListImgVerify>
                <ImgVerify onerror="this.onerror=null;this.src='../images/document_default.svg'"
                           src={checkImgData(dataResult.base64Front)} alt='icon'/>
                <ImgVerify onerror="this.onerror=null;this.src='../images/document_default.svg'"
                           src={checkImgData(dataResult.base64Back)}/>
                <ImgVerify onerror="this.onerror=null;this.src='../images/document_default.svg'"
                           src={checkImgData(dataResult.base64Face)}/>
            </ListImgVerify>
            <InfoDocument>
                Thông tin giấy tờ
            </InfoDocument>
            <InfoVerifyDocument>
                <InfoVerifyDocumentLeft>
                    <ItemDocument><ItemDocumentTitle>Loại giấy
                        tờ: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataBack.category)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitle>Số: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataFront.id_card)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitle>Ngày
                        cấp: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataBack.day_of_issue)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitle>Nơi
                        cấp: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataBack.place_of_issue)}</ItemDocumentValue></ItemDocument>
                </InfoVerifyDocumentLeft>
                <div><ItemDocument><ItemDocumentTitle>Họ và
                    tên: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataFront.full_name)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitle>Ngày
                        sinh: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataFront.day_of_birth)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitle>Thường
                        trú: </ItemDocumentTitle><ItemDocumentValue>{checkParamData(dataResult.dataFront.permanent_address)}</ItemDocumentValue></ItemDocument>
                    <ItemDocument><ItemDocumentTitleResult>Kết
                        quả: </ItemDocumentTitleResult><ItemResult>{dataResult.dataMatch.result}</ItemResult></ItemDocument>
                </div>
            </InfoVerifyDocument>
            <FootVerifyWeb>
                <ButtonTryAgain onClick={onTryAgain}>Thử lại</ButtonTryAgain>
            </FootVerifyWeb>
        </BodyVerify>
        <FootVerifyMobile>
            <ButtonTryAgain onClick={onTryAgain}>Thử lại</ButtonTryAgain>
        </FootVerifyMobile>
    </ResultVerify>)
}

function App() {
    const DEFAULT_STYLES = {
        background: "#dee9f3",
        background_blur: "#dee9f3b3",
        title_color: "#333333",
        text_content_color: "#565656",
        button_background: "#1967B2",
        hover_button_background: "#1967b2e6",
        primary_button_text_color: "#ffffff",
        secondary_button_text_color: "#333333",
        background_icon: "#C1D6E9",
        font_size_title: "20px",
        font_size_text: "14px",
        url_font_family: 'font/GoogleSans-Regular.ttf',
    }
    const ACCESS_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0aWVuMjQwNTk4dG4udG5AZ21haWwuY29tIiwiaWF0IjoxNjY5NjA0MTA0LCJleHAiOjE2NzE0MDQxMDR9.M3cwvJ1bLAwkkI4cS0GMQYvvRmfxIh51CFEGQAZhgEF94sJlUdI051HvUenXJvx-3lu_GmpuH1Rh8586Qw0UBQ"
    const [form] = Form.useForm();
    const [showResultVerify, setShowResultVerify] = useState(false)
    const [dataResult, setDataResult] = useState({})
    const [documentList, setDocumentList] = useState([])
    const [styles, setStyles] = useState(DEFAULT_STYLES);
    const onFinish = (values) => {
        const customTheme = {
            ...values,
            background: form.getFieldInstance('background').state.color,
            title_color: form.getFieldInstance('title_color').state.color,
            text_content_color: form.getFieldInstance('text_content_color').state.color,
            button_background: form.getFieldInstance('button_background').state.color,
            hover_button_background: form.getFieldInstance('hover_button_background').state.color,
            primary_button_text_color: form.getFieldInstance('primary_button_text_color').state.color,
        }
        setStyles(customTheme);
        let initObj = {
            ACCESS_TOKEN: ACCESS_TOKEN,
            STYLES: customTheme,
            PARENT_ID: "ekyc-bkav",
            VIEW_ID_AFTER_LOGOUT_SDK :"choose-styles",
            TYPE_CARD: values.typeCard,
            IS_LIVE_DETECTION: values.liveDetection,
        }
        window.bkavEKYC.init(initObj, callback)
        document.getElementById('choose-styles').style.display = "none";
    }
    const startSDK = () => {
        let initObj = {
            ACCESS_TOKEN: ACCESS_TOKEN,
            STYLES: styles,
            PARENT_ID: "ekyc-bkav",
            VIEW_ID_AFTER_LOGOUT_SDK :"choose-styles",
            TYPE_CARD: styles.typeCard,
            IS_LIVE_DETECTION: styles.liveDetection,
        }
        window.bkavEKYC.init(initObj, callback)
        document.getElementById('choose-styles').style.display = "none";
    }
    const callback = (res) => {
        setDataResult(res)
        setShowResultVerify(true)
    }

    const onTryAgain = () => {
        document.getElementById('ekyc-bkav').style.display = "block";
        let element = document.getElementById("ekyc-bkav");
        element.style.height = null;
        element.style.width = null;

        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
        document.getElementById('resultVerifyBkav').style.display = "none";
        setShowResultVerify(false)
        startSDK()
    }
    useEffect(() => {
        async function getIndentityDocument() {
            const headers = new Headers();
            headers.append("Authorization", "Bearer " + ACCESS_TOKEN);
            const DOMAIN_SERVER = "https://apiekyc.demozone.vn"
            const URL_GET_DOCUMENT_LIST = "/core-manager/getIndentityDocument";
            const requestOptions = {
                method: 'GET',
                headers: headers
            };
            let result = await fetch(DOMAIN_SERVER + URL_GET_DOCUMENT_LIST, requestOptions)
                .then((response) => response.json())
                .then(result => {
                    return result;
                })
            return result;
        }
        getIndentityDocument().then(res => {
            let documents = res.data.map(item => ({
                    value: item.identitydocumentid,
                    label: item.name
                }
            ))
            documents.push({value: 0, label: "Tất cả"});
            setDocumentList(documents)
        })
    }, []);
    const onChangeLiveDetection = (event) => {
        form.setFieldValue('liveDetection', event.target.checked)
    }
    return (
        <div className="App">
            <div id="choose-styles">
                <Form
                    form={form}
                    name="complex-form"
                    className="complexForm"
                    onFinish={onFinish}
                    initialValues={{...DEFAULT_STYLES, typeCard: null}}
                >
                    <h1 className="label"> Cấu hình eKYC </h1>
                    <Form.Item label="Background" name="background">
                        <ColorPicker color={DEFAULT_STYLES.background} />
                    </Form.Item>
                    <Form.Item label="Màu chữ tiêu đề" name="title_color">
                        <ColorPicker color={DEFAULT_STYLES.title_color} />
                    </Form.Item>
                    <Form.Item label="Màu chữ nội dung text" name="text_content_color">
                        <ColorPicker color={DEFAULT_STYLES.text_content_color} />
                    </Form.Item>
                    <Form.Item label="Màu nền button" name="button_background">
                        <ColorPicker color={DEFAULT_STYLES.button_background}
                                     />
                    </Form.Item>
                    <Form.Item label="Màu nền hover button" name="hover_button_background">
                        <ColorPicker color={DEFAULT_STYLES.hover_button_background}
                                     />
                    </Form.Item>
                    <Form.Item label="Màu chữ button" name="primary_button_text_color">
                        <ColorPicker color={DEFAULT_STYLES.primary_button_text_color}
                                     />
                    </Form.Item>
                    <Form.Item label="Màu nền icon" name="background_icon">
                        <ColorPicker color={DEFAULT_STYLES.background_icon} />
                    </Form.Item>
                    <Form.Item label="Cỡ chữ tiêu đề" name="font_size_title">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Cỡ chữ nội dung text" name="font_size_text">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Đường dẫn tải font chữ" name="url_font_family">
                        <Input/>
                    </Form.Item>
                    <Form.Item label="Loại giấy tờ" name="typeCard">
                        <Select
                            showSearch
                            placeholder="Chọn loại giấy tờ"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={documentList}
                        />
                    </Form.Item>
                    <Form.Item label="Sinh trắc học" name="liveDetection">
                        <Checkbox onChange={onChangeLiveDetection}/>
                    </Form.Item>
                    <Form.Item>
                        <button className="btn-start-check" id="eKYC_btn" htmlType="submit">Bắt đầu xác thực</button>
                    </Form.Item>
                </Form>
            </div>
            <div id='ekyc-bkav'></div>
            {showResultVerify ? (
                <ShowResult dataResult={dataResult.data} onBack={onTryAgain} onTryAgain={onTryAgain}/>) : null}
        </div>
    );
}

export default App;
