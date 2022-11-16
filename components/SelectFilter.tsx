import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useRouter } from 'next/router';
import { getParams } from '../utils/common/functions';

type Props = {
  data: any[][];
  title: string;
  keyword: string;
};

export default function SelectFilter({ data, title, keyword }: Props) {
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
    const query = {
      ...router.query,
      page: 1,
      [keyword]: event.target.value
    };
    const params = getParams(query);
    router.push(router.pathname + params);
  };

  return (
    <div
      style={{
        height: '28px'
      }}
    >
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel
          id='demo-controlled-open-select-label'
          size='small'
          sx={{
            fontSize: '12px',
            padding: 0,
            backgroundColor: 'transparent'
          }}
        >
          {title}
        </InputLabel>
        <Select
          labelId='demo-controlled-open-select-label'
          id='demo-controlled-open-select'
          label='Age'
          sx={{
            height: '32px'
          }}
          onChange={handleChange}
        >
          <MenuItem value=''>
            <em>None</em>
          </MenuItem>
          {data.map(([key, value]) => (
            <MenuItem key={key} value={key}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
