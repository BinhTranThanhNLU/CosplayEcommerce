package com.springboot.cosplay.responseDto;

import com.springboot.cosplay.dto.UserDTO;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserPageResponse {
    private List<UserDTO> users;
    private int currentPage;
    private int totalPages;
    private long totalItems;
}
