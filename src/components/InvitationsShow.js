import React, { Fragment, useState, useEffect } from 'react';
import { Table, Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { CSVLink } from "react-csv";
import Header from './Header';
import { localGetItem } from '../services/localstorage.service';
import InvitationService from '../services/apis/invitation.service';
import ToPDF from '../services/toPDF.service';

const InvitationsShow = () => {
  const [data, setData] = useState([]);

  const [state, setState] = useState(
    {
      searchText: '',
      searchedColumn: '',
    }
  );

  const [exportData, setExportData] = useState({
    title: '',
    headers: [],
    data: []
  })

  const parseDate = (dateStr) => {
    let year = dateStr.slice(0, 4);
    let month = dateStr.slice(5, 7);
    let day = dateStr.slice(8, 10);
    let time = dateStr.slice(11, 16);

    return `${year}/${month}/${day} ${time}`
  };

  const getColumnSearchProps = dataIndex => {
    let searchInput;
    return ({
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={node => {
              searchInput = node;
            }}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
        </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
        </Button>
        </div>
      ),
      filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: visible => {
        if (visible) {
          setTimeout(() => searchInput.select());
        }
      },
      render: text =>
        state.searchedColumn === dataIndex ? (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
            text
          ),
    })
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setState({ searchText: '' });
  };

  useEffect(() => {
    const token = localGetItem('jwt');

    InvitationService.getInvitations(token)
      .then(res => {
        setData(res.data.user.map(invitation => (
          {
            key: invitation.id,
            fullName: `${invitation.name} ${invitation.surname}`,
            email: invitation.email,
            empresa: invitation.empresa,
            date: parseDate(invitation.createdAt)
          }
        )))
      })
      .catch(err => {
        console.log(err);
      })
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: {
        compare: (a, b) => {
          try {
            return a.fullName.localeCompare(b.fullName)
          } catch (error) { }
        },
        multiple: 4,
      },
      ...getColumnSearchProps('fullName'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: {
        compare: (a, b) => {
          try {
            return a.email.localeCompare(b.email)
          } catch (error) { }
        },
        multiple: 3,
      },
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Company',
      dataIndex: 'empresa',
      key: 'empresa',
      sorter: {
        compare: (a, b) => {
          try {
            return a.empresa.localeCompare(b.empresa)
          } catch (error) { }
        },
        multiple: 2,
      },
      ...getColumnSearchProps('empresa'),
    },
    {
      title: 'Register Date',
      dataIndex: 'date',
      key: 'date',
      sorter: {
        compare: (a, b) => {
          try {
            return a.date.localeCompare(b.date)
          } catch (error) { }
        },
        multiple: 1,
      },
      ...getColumnSearchProps('date'),
    },
  ];

  const dataPrepare = () => {
    setExportData({
      title: 'Invitations',
      headers: [columns.map(column => column.title)],
      data: data.map(row => Object.values(row))
    });
  }

  const toPDF = () => {
    dataPrepare();
    ToPDF(exportData.title, exportData.headers, exportData.data, 'landscape');
  }

  return (
    <Fragment>
      <Header />
      <div id="seeInvitation">
        <div id="content">
          <h1>Invitations</h1>
          <div id="btn">
            <Button onClick={() => toPDF()}>PDF</Button>
            <CSVLink
              className="ant-btn"
              onClick={() => dataPrepare()}
              data={exportData.headers.concat(exportData.data)}>
                CSV
            </CSVLink>
          </div>
          <div id="table">
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default InvitationsShow;