import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor='pointer'
      bg='#E8E8E8'
      _hover={{
        background: '#38B2AC',
        color: 'white',
      }}
      w='100%'
      h='50px'
      d='flex'
      alignItems='center'
      color='black'
      px={3}
      py={2}
      mb={2}
      borderRadius='lg'>
      <div style={{ display: 'flex' }}>
        <Avatar
          style={{
            width: '45px',
            height: '50px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
          cursor='pointer'
          name={user.name}
          src={user.profilePicrur}
        />
        <Box style={{ display: 'flex', flexDirection: 'column' }}>
          <span> {user.username}</span>
          <span>Email :{user.email}</span>
        </Box>
      </div>
    </Box>
  );
};

export default UserListItem;
