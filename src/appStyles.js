import styled from 'styled-components';

const ResultVerify = styled.div`
  background-color: rgba(222, 233, 243, 0.7);
  margin: auto;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`
const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 64px;
  background-color: #FFFFFF;
`
const Back = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 24px;
  font-size: 17px;
  color: #333333;
  cursor: pointer;
`
const NameTitle = styled.div`
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  margin: auto;
  padding-right: 160px;
  @media (max-width: 768px) {
    padding-right: 45px;
  }
`
const BodyVerify = styled.div`
  margin: 24px;
  padding: 24px;
  height: 100%;
  border-radius: 16px;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  @media (max-width: 767px) {
    margin: 16px;
    padding: 16px;
  }
`
const FootVerifyMobile = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px; 
  margin-bottom: 16px ;
  @media (max-width: 767px) {
   display: flex;
  }
  @media (min-width: 767px) {
    display: none;
  }
`
const FootVerifyWeb = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  margin-top: 8px;
  @media (max-width: 767px) {
    display: none;
  }
  @media (min-width: 767px) {
    display: flex;
  }
`
const ButtonTryAgain = styled.div`
  height: 40px;
  width: 83px;
  border-radius: 20px;
  background-color: #1967B2;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @media (max-width: 767px) {
    width:100%;
    margin: 0 16px;
  }
`
const ListImgVerify = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(407px, 1fr));
  @media (max-width: 767px) {
    display: flex;
    gap: 8px; 
    // min-width: 676px;
  }
`
const ImgVerify = styled.img`
  border-radius: 16px;
  justify-self: stretch;
  height: 100%;
  width: 100%;
  //object-fit: cover;
  @media (max-width: 767px) {
    width: 45%;
  }
`
const InfoDocument = styled.div`
  margin: 24px 0px 16px 0px;
  color: #333333;
  font-size: 17px;
  font-weight: 700;
  @media (max-width: 767px) {
    display: none;
  }
`
const InfoVerifyDocument = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: 767px) {
    display: block;
    margin-top: 16px;
  }
`
const InfoVerifyDocumentLeft = styled.div`
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  @media (max-width: 767px) {
    margin-right: 0px;
  }
`
const ItemDocument = styled.div`
  display: flex;
  margin-bottom: 8px;
`
const ItemDocumentTitle = styled.div`
  width: 100px;
  color: #565656;
  font-weight: 400;
  @media (max-width: 767px) {
    width: 140px;
  }
`
const ItemDocumentTitleResult =  styled.div`
  width: 100px;
  color: #565656;
  font-weight: 400;
  @media (max-width: 767px) {
    display: none; 
  }
`
const ItemDocumentValue = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #565656;
  display: flex;
  align-items: center;
  @media (max-width: 767px) {
    width: 100%; 
    justify-content: end;
  }
`
const ItemResult = styled.div`
  color: #1967B2;
  font-size: 14px;
  font-weight: 700;
  @media (max-width: 767px) {
    font-size: 17px;
    margin-top: 32px;
    display: flex;
    justify-content: center;
    width: 100%;
  }
`
const TextBack = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`
export {
    ResultVerify,
    Title,
    Back,
    BodyVerify,
    FootVerifyMobile,
    FootVerifyWeb,
    NameTitle,
    ListImgVerify,
    ImgVerify,
    InfoDocument,
    InfoVerifyDocument,
    InfoVerifyDocumentLeft,
    ItemDocument,
    ItemDocumentTitle,
    ItemDocumentValue,
    ButtonTryAgain,
    ItemResult,
    TextBack,
    ItemDocumentTitleResult
};