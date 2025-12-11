"""
LeetCode API Integration Utility

This module handles fetching data from LeetCode's GraphQL API.
"""

import requests
from datetime import datetime
from typing import Dict, List, Optional


class LeetCodeAPI:
    """Handler for LeetCode GraphQL API requests"""
    
    GRAPHQL_URL = "https://leetcode.com/graphql"
    
    # GraphQL query for user profile stats
    USER_PROFILE_QUERY = """
    query getUserProfile($username: String!) {
        matchedUser(username: $username) {
            username
            profile {
                ranking
                userAvatar
                realName
                aboutMe
                reputation
            }
            submitStats {
                acSubmissionNum {
                    difficulty
                    count
                }
            }
        }
    }
    """
    
    # GraphQL query for recent submissions
    RECENT_SUBMISSIONS_QUERY = """
    query getRecentSubmissions($username: String!, $limit: Int!) {
        recentAcSubmissionList(username: $username, limit: $limit) {
            title
            titleSlug
            timestamp
            statusDisplay
            lang
        }
    }
    """
    
    # GraphQL query for contest info
    CONTEST_INFO_QUERY = """
    query getUserContestInfo($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
        }
    }
    """
    
    @staticmethod
    def fetch_user_profile(username: str) -> Optional[Dict]:
        """
        Fetch user profile data from LeetCode
        
        Args:
            username: LeetCode username
            
        Returns:
            Dictionary with user profile data or None if failed
        """
        try:
            response = requests.post(
                LeetCodeAPI.GRAPHQL_URL,
                json={
                    'query': LeetCodeAPI.USER_PROFILE_QUERY,
                    'variables': {'username': username}
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('data') and data['data'].get('matchedUser'):
                    return LeetCodeAPI._parse_profile_data(data['data']['matchedUser'])
            
            return None
            
        except Exception as e:
            print(f"Error fetching LeetCode profile for {username}: {str(e)}")
            return None
    
    @staticmethod
    def _parse_profile_data(matched_user: Dict) -> Dict:
        """Parse the matched user data into a clean format"""
        
        # Parse submission stats
        submit_stats = matched_user.get('submitStats', {})
        ac_submissions = submit_stats.get('acSubmissionNum', [])
        
        stats = {
            'total_solved': 0,
            'easy_solved': 0,
            'medium_solved': 0,
            'hard_solved': 0
        }
        
        for submission in ac_submissions:
            difficulty = submission.get('difficulty', '').lower()
            count = submission.get('count', 0)
            
            if difficulty == 'all':
                stats['total_solved'] = count
            elif difficulty == 'easy':
                stats['easy_solved'] = count
            elif difficulty == 'medium':
                stats['medium_solved'] = count
            elif difficulty == 'hard':
                stats['hard_solved'] = count
        
        # Parse profile info
        profile = matched_user.get('profile', {})
        
        return {
            'username': matched_user.get('username'),
            'ranking': profile.get('ranking'),
            'total_solved': stats['total_solved'],
            'easy_solved': stats['easy_solved'],
            'medium_solved': stats['medium_solved'],
            'hard_solved': stats['hard_solved'],
            'real_name': profile.get('realName'),
            'avatar': profile.get('userAvatar'),
            'reputation': profile.get('reputation')
        }
    
    @staticmethod
    def fetch_recent_submissions(username: str, limit: int = 10) -> List[Dict]:
        """
        Fetch recent accepted submissions
        
        Args:
            username: LeetCode username
            limit: Number of submissions to fetch
            
        Returns:
            List of submission dictionaries
        """
        try:
            response = requests.post(
                LeetCodeAPI.GRAPHQL_URL,
                json={
                    'query': LeetCodeAPI.RECENT_SUBMISSIONS_QUERY,
                    'variables': {'username': username, 'limit': limit}
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                submissions = data.get('data', {}).get('recentAcSubmissionList', [])
                
                return [{
                    'problem_title': sub.get('title'),
                    'problem_slug': sub.get('titleSlug'),
                    'status': sub.get('statusDisplay'),
                    'language': sub.get('lang'),
                    'timestamp': datetime.fromtimestamp(int(sub.get('timestamp', 0)))
                } for sub in submissions]
            
            return []
            
        except Exception as e:
            print(f"Error fetching recent submissions for {username}: {str(e)}")
            return []
    
    @staticmethod
    def fetch_contest_info(username: str) -> Optional[Dict]:
        """
        Fetch user contest information
        
        Args:
            username: LeetCode username
            
        Returns:
            Dictionary with contest info or None if failed
        """
        try:
            response = requests.post(
                LeetCodeAPI.GRAPHQL_URL,
                json={
                    'query': LeetCodeAPI.CONTEST_INFO_QUERY,
                    'variables': {'username': username}
                },
                headers={'Content-Type': 'application/json'},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                contest_data = data.get('data', {}).get('userContestRanking')
                
                if contest_data:
                    return {
                        'rating': int(contest_data.get('rating', 0)),
                        'global_ranking': contest_data.get('globalRanking'),
                        'contests_attended': contest_data.get('attendedContestsCount'),
                        'top_percentage': contest_data.get('topPercentage')
                    }
            
            return None
            
        except Exception as e:
            print(f"Error fetching contest info for {username}: {str(e)}")
            return None
