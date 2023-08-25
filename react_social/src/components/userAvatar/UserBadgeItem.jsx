import { CloseIcon } from '@chakra-ui/icons';
import { Badge, Box } from '@chakra-ui/react';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      style={{
        backgroundColor: 'lightgray',
        borderRadius: '5px',
        height: '25px',
        lineHeight: '25px',
        textAlign: 'center',
      }}
      px={2}
      py={1}
      borderRadius='lg'
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      colorScheme='purple'
      cursor='pointer'
      onClick={handleFunction}>
      {user.username}
      <CloseIcon pl={1} style={{ height: '8px' }} />
    </Badge>
  );
};

export default UserBadgeItem;
