'use client';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';

export default function TableSkeleton({ rows = 5, columns = 5, showHeader = true, headerHeight = 56 }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        {showHeader && (
          <TableHead>
            <TableRow>
              {Array.from(new Array(columns)).map((_, index) => (
                <TableCell key={`header-${index}`}>
                  <Skeleton variant="text" height={headerHeight / 2} />
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {Array.from(new Array(rows)).map((_, rowIndex) => (
            <TableRow key={`row-${rowIndex}`}>
              {Array.from(new Array(columns)).map((_, colIndex) => (
                <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                  <Skeleton variant="text" width={colIndex === 0 ? '60%' : '80%'} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}