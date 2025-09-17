using UnityEngine;

public class AuthService : MonoBehaviour {
    public static AuthService Instance;
    private string accessTokenKey = "access_token";

    void Awake() {
        if (Instance == null) { Instance = this; DontDestroyOnLoad(gameObject); }
        else Destroy(gameObject);
    }

    public void SaveAccessToken(string token) => PlayerPrefs.SetString(accessTokenKey, token);
    public string GetAccessToken() => PlayerPrefs.HasKey(accessTokenKey) ? PlayerPrefs.GetString(accessTokenKey) : null;
}
