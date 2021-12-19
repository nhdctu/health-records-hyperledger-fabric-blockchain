import React, { useState } from 'react'
import QrReader from 'react-qr-scanner'
import axios from 'axios';
import { Card, Table, Button, Modal, Tabs} from 'antd';
import {Alert} from 'antd';
import { DEFAULT_HOST } from '@/host';
import EditForm from '../../ManagePatient/Components/EditForm';
import { fetchCurrentUser } from '@/helpers/Auth';
import RegisterForm from '../../ManagePatient/Components/RegisterForm';
import HealthRecordForm from '../../ManagePatient/Components/HealthRecordForm';
import MedicalBillForm from '../../ManagePatient/Components/MedicalBillForm';

const { TabPane } = Tabs;
export default () => {
    const [result, setResult] = useState([])
    const [posting, setPosting] = useState(false);
    const [qr, setQR] = useState(true);
    const [a, setA] = useState(false);
    const [search, setSearch] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [editModal, setEditModal] = useState(false);
    const [editRow, setEditRow] = useState({});
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    const handleScan = (data) =>{
        if(data === null){ setResult([{text: 'null'}])}
        else {setResult(data);  setQR(false); setPosting(true)};
        return '';
    }
    const handleError= (error) =>{
        setResult(error);
        return '';
    }
    const previewStyle = {
      height: 240,
      width: 320,
    }
    const handleSetQR = async () => {
      setQR(true);
      setResult([]);
      setPosting(false);
      return '';
    }
    const handleSearch = async (value) => {

      const url = `${DEFAULT_HOST}/users/search-patient?field=user_id&value=${value}`;
      
      try {
          const res = await axios.get(url, config);
          if(res.data.success){
            setUsers(res.data.data);
            const urlS = `${DEFAULT_HOST}/receptionist/search-healthrecord?field=health_record_patient_id&value=${users[0].user_id}`;
            const result2 = await axios.get(urlS, config);
            setSearch(result2.data.valid);
            setA(false);
            setContentVisible(true);
            return "";
          }
          setA(true);
          setContentVisible(true);
          return "";
      } catch (error) {
          setA(true);
          setContentVisible(true);
          return "";
      }
    }
    if(posting){
       handleSearch(result.text);
    }
  const handleEditClick = (record) => {
    setEditRow(record);
    setEditModal(true);
    return '';
}
  const columns = [
    {
        title: "Tên người dùng",
        dataIndex: 'user_fullname',
        key: 'user_fullname',
        ellipsis: true,
    },
    {
        title: "Vai trò",
        dataIndex: 'user_role_name',
        key: 'user_role_name',
        ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: 'user_email',
      key: 'user_email',
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: 'user_phone',
      key: 'user_phone',
      ellipsis: true,
    },
    {
      title: "CMND/CCCD",
      dataIndex: 'user_identity_card',
      key: 'user_identity_card',
      ellipsis: true,
    },
    {
        title: "Thao tác",
        render: (text, record) => {
            if (!record.user_is_deleted)
                return <Button type='link' onClick={() => handleEditClick(record)}>Chỉnh sửa</Button>
                return <Button type='link' onClick={() => handleEditClick(record)}>Kích hoạt ngay</Button>
        }
    }
]
    return(
        <>
      <Card>
        {!qr?  <Button onClick={handleSetQR}>Làm lại</Button> :<QrReader
          delay={200}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
          legacyMode={true}
          disabled={posting}
          /> }
      </Card>
      {
        contentVisible ? (
          <>
              {
                  a ? <Card>
                        <Alert showIcon message="Không tìm thấy!"></Alert> 
                        <RegisterForm></RegisterForm>
                      </Card>
                    :
                    <>
                      <Card>
                          
                          <Tabs tabPosition="left">
                                <TabPane tab="Kết quả tìm kiếm" key="1" >
                                    <Table columns={columns} dataSource={users}></Table>
                                </TabPane>
                                <TabPane tab="Quản lý sổ khám" key="2">
                                  { search ? <MedicalBillForm userValue={users[0]}></MedicalBillForm>
                                    :<HealthRecordForm id={users[0].user_id}></HealthRecordForm>
                                  }
                                </TabPane>
                                {/* <TabPane tab="Chỉnh sửa thông tin" key="3" >
                                  <Tag>{users[0].user_fullname}</Tag>
                                </TabPane> */}
                            </Tabs>
                      </Card>

                      <Modal
                          visible={editModal}
                          footer={null}
                          onCancel={() => setEditModal(false)}
                          title= "Chỉnh sửa người dùng"
                          destroyOnClose
                          centered
                      >
                          <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
                      </Modal>
                    </>
              }
          </>
        ) : null
      }
    </>
    )
}