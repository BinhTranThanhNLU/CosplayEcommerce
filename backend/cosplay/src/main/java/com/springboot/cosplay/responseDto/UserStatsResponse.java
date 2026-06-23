package com.springboot.cosplay.responseDto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatsResponse {
    private long totalUsers;
    private long bannedUsers;
    private long activeUsers;
    private long customerCount;
    private long sellerCount;
}
