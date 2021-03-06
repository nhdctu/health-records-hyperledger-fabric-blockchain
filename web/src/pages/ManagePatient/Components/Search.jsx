import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Card, Table, Button, Modal, Select , Form, Tabs} from 'antd';
import {Input, Alert} from 'antd';
import { DEFAULT_HOST } from '@/host';
import EditForm from './EditForm';
import { fetchCurrentUser } from '@/helpers/Auth';
import RegisterForm from './RegisterForm';
import HealthRecordForm from './HealthRecordForm';
import EditHealthRecord from './EditHealthRecord';
import CheckQR from './CheckQR';

const { TabPane } = Tabs;
const Option = Select;
export default () => {
    const [a, setA] = useState(false);
    const [b, setB] = useState(false);
    const [search, setSearch] = useState(false);
    const [contentVisible, setContentVisible] = useState(false);
    const [users, setUsers] = useState([]);
    const [patients, setPatients] = useState([]);
    const [idS, setIds] = useState('');
    const [editModal, setEditModal] = useState(false);
    const [editRow, setEditRow] = useState({});
    const user = fetchCurrentUser();
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    }

    useEffect(() => {
      const f = async () => { 
        const urlP = `${DEFAULT_HOST}/users/search/patient`; 
        const resultP = await axios.get(urlP, config);
        setPatients(resultP.data.data);
        if (idS !== ""){
          const url = `${DEFAULT_HOST}/users/search-patient?field=user_id&value=${idS}`; 
          const result = await axios.get(url, config);
          setUsers(result.data.data);
          return "";
        } 
        return ""
      }     
      f();
    }, [editModal]);

    const handleSearch = async (value) => {

      const url = `${DEFAULT_HOST}/users/search-patient?field=${value.field}&value=${value.key}`;
      try {
        
          const result = await axios.get(url, config);
          if(result.data.success){
            setUsers(result.data.data);
            setIds(result.data.data[0].user_id);
            if (result.data.data[0].user_id !== undefined) {
              setA(false);
              const urlS = `${DEFAULT_HOST}/receptionist/search-healthrecord?field=health_record_patient_id&value=${result.data.data[0].user_id}`;
              const result2 = await axios.get(urlS, config);
              setSearch(result2.data.valid);
              setContentVisible(true);
              return "";
            } 
            setUsers(result.data.data);
            setA(false);
            const urlS = `${DEFAULT_HOST}/receptionist/search-healthrecord?field=health_record_patient_id&value=${result.data.data[0].user_id}`;
            const result2 = await axios.get(urlS, config);
            setSearch(result2.data.valid);
            setContentVisible(true);
            return "";
          }
          setA(true);
          setContentVisible(true);
          return "";
      } catch (error) {
          setA(true);
          setContentVisible(true);
      }
      return "";
  }

  const handleEditClick = (record) => {
    setEditRow(record);
    setEditModal(true);
  }
   const handleB = () => {
     setB(true);
   }
   const handleC = () => {
    setB(false);
  }
    const columns = [
      {
          title: "T??n ng?????i d??ng",
          dataIndex: 'user_fullname',
          key: 'user_fullname',
          ellipsis: true,
      },
      {
        title: "Email",
        dataIndex: 'user_email',
        key: 'user_email',
        ellipsis: true,
      },
      {
        title: "CMND/CCCD",
        dataIndex: 'user_identity_card',
        key: 'user_identity_card',
        ellipsis: true,
      },
      {
          title: "BHYT",
          dataIndex: 'user_health_insurance',
          key: 'user_health_insurance',
          ellipsis: true,
      },
      {
        title: "S??? ??i???n tho???i",
        dataIndex: 'user_phone',
        key: 'user_phone',
        ellipsis: true,
      },
      
      {
          title: "Thao t??c",
          render: (text, record) => {
              if (!record.user_is_deleted)
                  return <Button type='link' onClick={() => handleEditClick(record)}>Xem chi ti???t</Button>
                  return <Button type='link' onClick={() => handleEditClick(record)}>K??ch ho???t ngay</Button>
          }
      }
  ]
  return (
    <>
    <Tabs tabPosition="top">
      <TabPane tab="Qu???n l?? s??? kh??m b???nh" key="1">
        <Card>
          <Form 
            autoComplete="off"
            labelAlign="left"
            onFinish={handleSearch}
            style={{width:820}}
          >
            <Form.Item label="T??m ki???m b???ng" name="field" style={{width: 300 ,float:'left'}}>
              <Select >
                <Option value="user_phone">S??? ??i???n tho???i</Option>
                <Option value="user_email" >Email</Option>
                <Option value="user_identity_card">S??? CMND/CCCD</Option>
              </Select>
            </Form.Item>
            <Form.Item name="key" style={{width: 300 ,float:'left', marginLeft: 10}}>
              <Input 
                placeholder="Nh???p n???i dung t??m ki???m" 
              ></Input>
            </Form.Item>
              <Button 
                type="primary"
                htmlType="submit"
                style={{width: 200 ,float:'right'}}
              >
                T??m ki???m
              </Button>
          </Form>
        </Card>
        {
        contentVisible ? (
          <>
              {
                  a ?
                  <> <Card>
                        <Alert showIcon message="Kh??ng t??m th???y!" style={{margin: 10}}></Alert> 
                        <Table columns={columns} dataSource={patients}></Table>
                        
                      </Card>
                      <Modal
                          visible={editModal}
                          footer={null}
                          onCancel={() => setEditModal(false)}
                          title= "Ch???nh s???a ng?????i d??ng"
                          destroyOnClose
                          centered
                      >
                          <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
                      </Modal>
                      </>
                    :
                    <>
                      <Card>
                          <Tabs tabPosition="left">
                                <TabPane tab="K???t qu??? t??m ki???m" key="1">
                                    <Table columns={columns} dataSource={users}></Table>
                                </TabPane>
                                <TabPane tab="Qu???n l?? s??? kh??m b???nh" key="2">
                                  { search ? <EditHealthRecord pId={users[0].user_id}></EditHealthRecord>
                                    :<HealthRecordForm id={users[0].user_id}></HealthRecordForm>
                                  }
                                </TabPane>
                                {/* <TabPane tab="Ch???nh s???a th??ng tin" key="3" >
                                  <Tag>{users[0].user_fullname}</Tag>
                                </TabPane> */}
                            </Tabs>
                      </Card>
                      <Modal
                          visible={editModal}
                          footer={null}
                          onCancel={() => setEditModal(false)}
                          title= "Ch???nh s???a ng?????i d??ng"
                          destroyOnClose
                          centered
                      >
                          <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
                      </Modal>
                    </>
              }
          </>
        ) : 
        <>
          <Table columns={columns} dataSource={patients}></Table> 
          <Modal
            visible={editModal}
            footer={null}
            onCancel={() => setEditModal(false)}
            title= "Ch???nh s???a ng?????i d??ng"
            destroyOnClose
            centered
          >
            <EditForm onCancel={() => setEditModal(false)} defaultValue={editRow} />
          </Modal>
        </>
      }
      </TabPane>
      <TabPane tab="????ng k?? h??? s??" key="2">
        <RegisterForm></RegisterForm>
      </TabPane>
      <TabPane tab="T???o phi???u kh??m b???nh" key="3">
        {b ?
        <><CheckQR></CheckQR> <Button  style={{margin: 10}} onClick={handleC}>D???ng</Button></>: <Button onClick={handleB}>B???t ?????u</Button>
        }
      </TabPane>
    </Tabs>
      
      </>
  )
}
